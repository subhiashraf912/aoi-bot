import {
  Channel,
  ChatInputCommandInteraction,
  GuildChannel,
  GuildMember,
  Role,
} from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class ChannelDelete extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "delete",
      baseCommand: "channel",
      description: "Deletes a channel from the server",
    });
    this.commandBuilder.addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to delete!")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const channel = interaction.options.getChannel(
      "channel",
      true
    ) as GuildChannel;

    const reason = `Responsible user: ${
      (interaction.member as GuildMember).user.tag
    }`;

    try {
      await channel.delete(reason);
      await interaction.reply({
        content: `The channel ${channel.name} has been deleted.`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
