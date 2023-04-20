import { ChannelType, ChatInputCommandInteraction } from "discord.js";
import DiscordClient from "../../../classes/client/BaseClient";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import BirthdaySystem from "../../../classes/Database/Models/BirthdaySystemSchema";

export default class SetBirthdayChannelCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "channel",
      description: "Change the birthday message channel.",
      baseCommand: "set-birthday",
    });
    this.commandBuilder.addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send birthday messages in.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const serverId = interaction.guildId;
    const channel = interaction.options.getChannel("channel", true);

    await BirthdaySystem.findOneAndUpdate(
      { serverId },
      { birthdayChannel: channel.id }
    );

    await interaction.reply({
      content: `Birthday message channel has been changed to ${channel.toString()}.`,
    });
  }
}
