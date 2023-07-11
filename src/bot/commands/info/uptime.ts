import { CacheType, CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class UptimeSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "uptime",
      description: "Gets bot uptime!",
    });
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    const uptime = client.uptime; // Assumes client.uptime returns bot's uptime
    interaction.reply({
      content: `Bot's uptime: ${uptime}`,
    });
  }
}
