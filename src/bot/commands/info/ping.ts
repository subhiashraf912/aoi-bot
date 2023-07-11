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
      const sent = await interaction.reply({
        content: "Pinging...",
        fetchReply: true,
      });

      const ping = sent.createdTimestamp - interaction.createdTimestamp;

      await interaction.editReply({
        content: `Pong! The latency is ${ping / 3}ms.`,
      });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
