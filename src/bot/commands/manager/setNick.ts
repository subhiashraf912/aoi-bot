import { CacheType, CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class HelpSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "set-nickname",
      description: "Sets the nickname for a user!",
    });
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    try {
      interaction.reply({
        content: "this is the purge command!",
      });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
