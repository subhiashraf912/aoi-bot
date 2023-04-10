import { CacheType, CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class PingSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "ping",
      description: "Pings the bot and gets the response in milliseconds!",
    });
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    try {
      interaction.reply({
        content: "This is the ping command!",
      });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
