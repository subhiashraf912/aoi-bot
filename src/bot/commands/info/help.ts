import { CacheType, CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class HelpSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "help",
      description: "Shows the help list!",
    });
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    try {
      interaction.reply({
        content:
          "This is the help list, it will be updated as soon as possible!",
      });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
