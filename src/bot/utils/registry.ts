import path from "path";
import fs from "fs/promises";
import { BaseSlashCommand } from "../classes/bases/BaseSlashCommand";
import DiscordClient from "../classes/client/BaseClient";
import {
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import BaseSubCommandExecutor from "../classes/bases/BaseSubCommandExecutor";
import {
  subcommandsRawData,
  subcommandsGroupsRawData,
} from "./subcommands/subcommandsRawData";
import BaseWebSocketEvent from "../classes/bases/BaseWebsocketEvent";

// Utility function to get files in a directory
async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat();
}

// Utility function to register a module based on its type
async function registerModule(
  client: DiscordClient<boolean>,
  modulePath: string,
  type: "command" | "websocket" | "subcommand" | "event"
) {
  const { default: Module } = await import(modulePath);

  switch (type) {
    case "command": {
      const command: BaseSlashCommand = new Module();
      client.slashCommands.set(command.name, command);
      break;
    }
    case "websocket": {
      const event: BaseWebSocketEvent = new Module();
      client.socket.on(event.name, event.run.bind(event, client));
      break;
    }
    case "subcommand": {
      const command: BaseSubCommandExecutor = new Module();
      const baseCommandName = command.baseCommand;

      if (command.group) {
        // add subcommand to group
        const group = client.subcommandsGroups.get(
          `${baseCommandName}_${command.group}`
        ) || {
          baseCommand: baseCommandName,
          builder: new SlashCommandSubcommandGroupBuilder()
            .setName(command.group)
            .setDescription(`${command.group} group`),
          registeredCommands: [],
          name: command.group,
        };

        if (!group.registeredCommands.includes(command.name)) {
          group.builder.addSubcommand(command.commandBuilder);
          group.registeredCommands.push(command.name);
        }

        client.subcommandsGroups.set(
          `${group.baseCommand}_${group.name}`,
          group
        );
      }

      client.subcommands.set(`${command.baseCommand}_${command.name}`, command);
      break;
    }
    case "event": {
      const event = new Module();
      client.events.set(event.getName(), event);
      client.on(event.getName(), event.run.bind(event, client));
      break;
    }
  }
}
// Your registration functions become much cleaner
export async function registerCommands(
  client: DiscordClient<boolean>,
  dir = "../commands"
) {
  const files = await getFiles(path.join(__dirname, dir));
  await Promise.all(
    files
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
      .map((file) => registerModule(client, file, "command"))
  );
}

export async function registerEvents(
  client: DiscordClient<boolean>,
  dir: string = "../events"
) {
  const files = await getFiles(path.join(__dirname, dir));
  await Promise.all(
    files
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
      .map((file) => registerModule(client, file, "event"))
  );
}

export async function registerWebsocketEvents(
  client: DiscordClient<boolean>,
  dir: string = "../websocket"
) {
  const files = await getFiles(path.join(__dirname, dir));
  await Promise.all(
    files
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
      .map((file) => registerModule(client, file, "websocket"))
  );
}

export async function registerSlashSubcommands(
  client: DiscordClient<boolean>,
  dir = "../subcommands"
) {
  const files = await getFiles(path.join(__dirname, dir));
  const registerPromises = files
    .filter((file) => {
      // console.log(file);
      return file.endsWith(".ts") || file.endsWith(".js");
    })
    .map((file) => {
      return registerModule(client, file, "subcommand");
    });
  await Promise.all(registerPromises);
}
function assignSubcommandsGroups(client: DiscordClient<boolean>) {
  client.subcommandsGroups.forEach((group) => {
    const groupName =
      group.baseCommand as keyof typeof subcommandsGroupsRawData;
    const { permissions, description, directCommands } =
      subcommandsGroupsRawData[groupName] ?? {};

    let commandBuilder = client.subcommandsBuilders.get(group.baseCommand);
    if (!commandBuilder) {
      commandBuilder = new SlashCommandBuilder()
        .setName(group.baseCommand)
        .setDescription(description || `${group.baseCommand} command`)
        .setDMPermission(directCommands);
      client.subcommandsBuilders.set(group.baseCommand, commandBuilder);
    }

    if (permissions) {
      commandBuilder.setDefaultMemberPermissions(permissions);
    }

    commandBuilder.addSubcommandGroup(group.builder);
  });
}

function assignSubcommands(client: DiscordClient<boolean>) {
  client.subcommands.forEach((subcommand) => {
    if (subcommand.group) return;

    const baseCommandName =
      subcommand.baseCommand as keyof typeof subcommandsRawData;
    const { permissions, description, directCommands } =
      subcommandsRawData[baseCommandName] ?? {};

    let commandBuilder = client.subcommandsBuilders.get(subcommand.baseCommand);
    if (!commandBuilder) {
      commandBuilder = new SlashCommandBuilder()
        .setName(subcommand.baseCommand)
        .setDescription(description || `${subcommand.name} command`)
        .setDMPermission(directCommands);
      client.subcommandsBuilders.set(subcommand.baseCommand, commandBuilder);
    }

    if (permissions) {
      commandBuilder.setDefaultMemberPermissions(permissions);
    }

    commandBuilder.addSubcommand(subcommand.commandBuilder);
  });
}

function assignSlashSubcommandsGroupsAndSubcommandsToClientCollection(
  client: DiscordClient<boolean>
) {
  assignSubcommandsGroups(client);
  assignSubcommands(client);
}

export async function pushCommands(client: DiscordClient<boolean>) {
  const { APP_ID, GUILD_ID } = process.env;
  const slashCommandsJSON = client.slashCommands.map((command) =>
    command.getSlashCommandJSON()
  );
  const slashSubCommandsJSON = client.subcommandsBuilders.map((command) =>
    command.toJSON()
  );
  const combinedCommands = [...slashCommandsJSON, ...slashSubCommandsJSON];

  try {
    await client.rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), {
      body: combinedCommands,
    });
    // await client.rest.put(Routes.applicationCommands(APP_ID), {
    //   body: combinedCommands,
    // });
    console.log("Commands pushed successfully!");
  } catch (err) {
    console.error(err);
  }
}

export async function clientRegistry(client: DiscordClient<boolean>) {
  console.log("Registering commands...");
  await registerCommands(client);
  console.log("Registering events...");
  await registerEvents(client);
  console.log("Registering websocket events...");
  await registerWebsocketEvents(client);
  console.log("Registering slash subcommands...");
  await registerSlashSubcommands(client);
  console.log("Assigning slash subcommands to client collection...");
  assignSlashSubcommandsGroupsAndSubcommandsToClientCollection(client);
}
