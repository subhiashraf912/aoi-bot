import {
  CategoryChannel,
  ChannelType,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class ChannelCreateCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "create",
      baseCommand: "channel",
      description: "Creates a channel with specific settings in the server",
    });
    this.commandBuilder
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the role you want to create!")
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("category")
          .setDescription("The category you want the channel be a child of")
          .addChannelTypes(ChannelType.GuildCategory)
      )
      .addBooleanOption((option) =>
        option
          .setName("hidden")
          .setDescription("If you want the channel to be hidden select True")
      );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const name = interaction.options.getString("name", true);
    const category =
      (interaction.options.getChannel("category", false) as
        | CategoryChannel
        | undefined) || undefined;
    const hidden = interaction.options.getBoolean("hidden", false) || undefined;
    const reason = `Responsible user: ${
      (interaction.member as GuildMember).user.tag
    }`;

    try {
      const channel = await interaction.guild?.channels.create({
        name,
        parent: category,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone.id,
            deny: hidden ? ["ViewChannel"] : [],
          },
        ],
        reason,
      });
      await interaction.reply({
        content: `The channel ${channel?.toString()} has been created with the following settings\n> Name: ${name}\n> Category: ${
          category?.toString() || "Not Specified"
        }\n> Hidden Channel?: ${hidden ? "Yes" : "No"}`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
