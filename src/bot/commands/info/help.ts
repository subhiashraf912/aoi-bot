import {
  CacheType,
  CommandInteraction,
  ApplicationCommandOptionType,
} from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class HelpSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "help",
      description: "Shows all commands and their descriptions",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    const commands = await client.application?.commands.fetch();

    if (!commands) {
      {
        interaction.reply({
          content: "No commands found",
          ephemeral: true,
        });
      }
      return;
    }

    let reply = "";

    commands.forEach((command) => {
      console.log(
        `Command: ${command.name} | Description: ${command.description}`
      );
      reply += `**/${command.name}**: ${command.description}\n`;

      if (command.options) {
        command.options.forEach((option) => {
          switch (option.type) {
            case ApplicationCommandOptionType.Subcommand:
            case ApplicationCommandOptionType.SubcommandGroup:
              reply += `\t**${option.name}**: ${option.description}\n`;
              break;
            default:
              reply += `\t**${option.name}** (type: ${option.type}): ${option.description}\n`;
              break;
          }
        });
      }

      reply += "\n";
    });

    interaction.reply({
      content: reply,
      ephemeral: true, // Change to false if you want the reply to be public
    });
  }
}
