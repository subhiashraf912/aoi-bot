import { ChannelType, ChatInputCommandInteraction, Role } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class SetWelcomeChannelCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "set",
      baseCommand: "welcomer",
      description: "Set the welcome channel for the server",
      group: "channel",
    });
    this.commandBuilder.addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to set as the welcome channel")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const channel = interaction.options.getChannel("channel", true);
    const guildId = interaction.guildId!;
    let welcomeSystem = await client.database.models.welcomeSystem.findOne({
      guildId,
    });

    if (!welcomeSystem) {
      welcomeSystem = await client.database.models.welcomeSystem.create({
        guildId: guildId,
        channelId: channel.id,
        content: "Welcome to {guildName}, {member-mention}!",
        sendAttachment: false,
        enabled: true,
      });
    } else {
      welcomeSystem.channelId = channel.id;
      await welcomeSystem.save();
    }

    await interaction.reply(`Welcome channel set to ${channel.toString()}.`);
  }
}
