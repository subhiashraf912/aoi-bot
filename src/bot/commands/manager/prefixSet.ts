import { CacheType, ChatInputCommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class SetPrefixSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "prefix-set",
      description: "Changes the bot prefix!",
    });
    this.slashCommandBuilder.addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("The new prefix")
        .setRequired(true)
    );
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    const newPrefix = interaction.options.getString("prefix", true); // Assumes 'prefix' is the new prefix

    await client.configurations.prefixes.update(
      interaction.guildId!,
      newPrefix
    );

    interaction.reply({
      content: `Bot's prefix has been changed to: ${newPrefix}`,
    });
  }
}
