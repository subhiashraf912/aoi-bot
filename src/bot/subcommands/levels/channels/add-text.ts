import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
} from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class ChannelCreateCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "add-text",
      baseCommand: "levels",
      group: "channels",
      description: "Adds a text level channel to the database.",
    });
    this.commandBuilder.addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "If there's no channels set, member will get xp in all channels."
        )
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const channel = (await interaction.guild?.channels.fetch(
        interaction.options.getChannel("channel", true).id
      )) as GuildTextBasedChannel;

      const { channels } = await client.configurations.textLevels.channels.get(
        interaction.guildId!
      );
      if (channels.includes(channel.id)) {
        interaction.reply(
          "This channel already exists in the text level channels list."
        );
        return;
      }
      channels.push(channel.id);
      await client.configurations.textLevels.channels.update({
        channels,
        guildId: interaction.guildId!,
      });
      await interaction.reply({
        content: `${channel.toString()} has been added to the text level channels list.`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
