import { ChannelType, ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class TextLevelMessageChannel extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "message-channel",
      baseCommand: "levels",
      group: "text",
      description:
        "Sets a customized message channel to send the level up message in.",
    });
    this.commandBuilder
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            "The channel that bot will send the level up message in."
          )
          .addChannelTypes(ChannelType.GuildText)
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
      const channel = interaction.options.getChannel("channel");
      await client.configurations.textLevels.levelingGuilds.get(
        interaction.guildId!
      );
      if (useDefault) {
        await client.configurations.textLevels.levelingGuilds.update({
          guildId: interaction.guildId!,
          levelUpMessageChannelId: null,
        });
        await interaction.reply({
          content: `The level messages have been set to the default channel!`,
        });
        return;
      }
      if (!channel) {
        interaction.reply({
          content:
            "You should provide a channel with your command options, or use default attribute if you want to disable the custom channel for the level message. ",
        });
        return;
      }
      await client.configurations.textLevels.levelingGuilds.update({
        guildId: interaction.guildId!,
        levelUpMessageChannelId: channel.id,
      });
      await interaction.reply({
        content: `The channel ${channel.toString()} has been set as a channel for level messages!`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
