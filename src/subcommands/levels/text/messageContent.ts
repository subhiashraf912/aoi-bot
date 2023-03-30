import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class TextLevelMessageContent extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "message-content",
      baseCommand: "levels",
      group: "text",
      description: "Sets a customized level up message.",
    });
    this.commandBuilder
      .addStringOption((option) =>
        option
          .setName("content")
          .setDescription("You can use {member-ping/tag/username} {level}.")
          .setAutocomplete(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("default")
          .setDescription(
            "Sends the level message in same channel as original message."
          )
      );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const useDefault = interaction.options.getBoolean("default");
      const content = interaction.options.getString("content");
      await client.configurations.textLevels.levelingGuilds.get(
        interaction.guildId!
      );
      if (useDefault) {
        await client.configurations.textLevels.levelingGuilds.update({
          guildId: interaction.guildId!,
          levelUpMessageContent: null,
        });
        return;
      }
      if (!content) {
        interaction.reply({
          content:
            "You should provide a content with your command options, or use default attribute if you want to disable the custom content for the level message. ",
        });
        return;
      }
      await client.configurations.textLevels.levelingGuilds.update({
        guildId: interaction.guildId!,
        levelUpMessageContent: content,
      });
      await interaction.reply({
        content: `The level message has been successfully updated to:\n >${content}!`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
