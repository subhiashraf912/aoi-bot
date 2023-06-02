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

export async function registerCommands(
  client: DiscordClient<boolean>,
  dir = "../commands"
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory())
      await registerCommands(client, path.join(dir, file));
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const { default: Command } = await import(path.join(filePath, file));
      const command: BaseSlashCommand = new Command();
      client.slashCommands.set(command.name, command);
    }
  }
}

export async function registerWebsocketEvents(
  client: DiscordClient<boolean>,
  dir: string = "../websocket"
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory())
      registerWebsocketEvents(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Event } = await import(path.join(dir, file));
      const event: BaseWebSocketEvent = new Event();
      client.socket.on(event.name, event.run.bind(event, client));
    }
  }
}

export async function registerSlashSubcommands(
  client: DiscordClient<boolean>,
  dir = "../subcommands"
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory())
      await registerSlashSubcommands(client, path.join(dir, file));
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const { default: Command } = await import(path.join(filePath, file));

      const command: BaseSubCommandExecutor = new Command();
      const baseCommandName = command.baseCommand;
      if (command.group) {
        if (
          !client.subcommandsGroups.find(
            (group, groupName) =>
              group.baseCommand === baseCommandName &&
              groupName === `${group.baseCommand}_${command.group}`
          )
        ) {
          const group = new SlashCommandSubcommandGroupBuilder()
            .setName(command.group)
            .setDescription(`${command.group} group`);

          client.subcommandsGroups.set(`${baseCommandName}_${group?.name!}`, {
            baseCommand: baseCommandName,
            builder: group,
            registeredCommands: [],
            name: command.group,
          });
        }
        const group = client.subcommandsGroups.find(
          (group, groupName) =>
            group.baseCommand === baseCommandName &&
            groupName === `${group.baseCommand}_${command.group}`
        );

        if (
          !group?.registeredCommands.includes(command.name) &&
          command.group === group?.name
        ) {
          group?.builder.addSubcommand(command.commandBuilder);
          group?.registeredCommands.push(command.name);
          client.subcommandsGroups.set(
            `${group.baseCommand}_${group?.name!}`,
            group!
          );
        }

        client.subcommands.set(
          `${command.baseCommand}_${command.name}`,
          command
        );
      } else {
        client.subcommands.set(
          `${command.baseCommand}_${command.name}`,
          command
        );
      }
    }
  }
}

export async function registerEvents(
  client: DiscordClient<boolean>,
  dir: string = "../events"
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Event } = await import(path.join(dir, file));
      const event = new Event();
      client.events.set(event.getName(), event);
      client.on(event.getName(), event.run.bind(event, client));
    }
  }
}

function assignSlashSubcommandsGroupsAndSubcommandsToClientCollection(
  client: DiscordClient<boolean>
) {
  client.subcommandsGroups.forEach((group) => {
    const groupName =
      group.baseCommand as keyof typeof subcommandsGroupsRawData;
    const permissions = subcommandsGroupsRawData[groupName]?.permissions;
    const description = subcommandsGroupsRawData[groupName]?.description;
    const directCommands = subcommandsGroupsRawData[groupName]?.directCommands;
    if (permissions) {
      client.subcommandsBuilders
        .get(group.baseCommand)
        ?.setDefaultMemberPermissions(permissions);
    }

    if (!client.subcommandsBuilders.get(group.baseCommand)) {
      client.subcommandsBuilders.set(
        group.baseCommand,
        new SlashCommandBuilder()
          .setName(group.baseCommand)
          .setDescription(description || `${group.baseCommand} command`)
          .setDMPermission(directCommands)
      );
    }

    client.subcommandsBuilders
      .get(group.baseCommand)
      ?.addSubcommandGroup(group.builder);
  });

  client.subcommands.forEach((subcommand) => {
    if (subcommand.group) return;
    const baseCommandName =
      subcommand.baseCommand as keyof typeof subcommandsRawData;

    const permissions = subcommandsRawData[baseCommandName]?.permissions;
    const description = subcommandsRawData[baseCommandName]?.description;
    const directCommands = subcommandsRawData[baseCommandName]?.directCommands;
    if (!client.subcommandsBuilders.get(subcommand.baseCommand)) {
      client.subcommandsBuilders.set(
        subcommand.baseCommand,
        new SlashCommandBuilder()
          .setName(subcommand.baseCommand)
          .setDescription(description || `${subcommand.name} command`)
          .setDMPermission(directCommands)
      );

      if (permissions) {
        client.subcommandsBuilders
          .get(subcommand.baseCommand)
          ?.setDefaultMemberPermissions(permissions);
      }
    }
    client.subcommandsBuilders
      .get(subcommand.baseCommand)
      ?.addSubcommand(subcommand.commandBuilder);
  });
}
//
export async function clientRegistry(client: DiscordClient<boolean>) {
  const { APP_ID, GUILD_ID } = process.env;
  await registerCommands(client);
  await registerEvents(client);
  await registerWebsocketEvents(client);
  await registerSlashSubcommands(client);
  assignSlashSubcommandsGroupsAndSubcommandsToClientCollection(client);

  const slashCommandsJSON = client.slashCommands.map((command) =>
    command.getSlashCommandJSON()
  );
  const slashSubCommandsJSON = client.subcommandsBuilders.map((command) =>
    command.toJSON()
  );
  const combinedCommands = [...slashCommandsJSON, ...slashSubCommandsJSON];

  await client.rest.put(Routes.applicationCommands(APP_ID), {
    body: combinedCommands,
  });
  try {
    await client.rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), {
      body: [],
    });
  } catch (err) {
    console.log(err);
  }
}
