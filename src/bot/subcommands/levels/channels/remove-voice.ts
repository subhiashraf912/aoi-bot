import {
  ChannelType,
  ChatInputCommandInteraction,
  VoiceBasedChannel,
} from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class ChannelCreateCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "remove-voice",
      baseCommand: "levels",
      group: "channels",
      description: "Removes a voice level role to the database.",
    });
    this.commandBuilder.addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "If there's no channels set, member will get xp in all channels."
        )
        .addChannelTypes(ChannelType.GuildVoice)
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
      )) as VoiceBasedChannel;

      const { channels } = await client.configurations.voiceLevels.channels.get(
        interaction.guildId!
      );
      if (!channels.includes(channel.id)) {
        interaction.reply(
          "This channel already does not exists in the voice level channels list."
        );
        return;
      }
      const index = channels.indexOf(channel.id);
      channels.splice(index, 1);
      await client.configurations.voiceLevels.channels.update({
        channels,
        guildId: interaction.guildId!,
      });
      await interaction.reply({
        content: `${channel.toString()} has been removed from the voice level channels list.`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
