import { CacheType, ChatInputCommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class PrefixSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "prefix",
      description: "Gets the bot prefix!",
    });
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    const prefix = await client.configurations.prefixes.get(
      interaction.guildId!
    );
    interaction.reply({
      content: `Bot's prefix is: ${prefix}`,
    });
  }
}
