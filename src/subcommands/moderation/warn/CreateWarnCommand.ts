import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class WarnCreateCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "create",
      baseCommand: "warn",
      description: "create a warn from a specific user!",
    });
    this.commandBuilder
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Mention the user you want to warn!")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("reason").setDescription("The reason of the warn!")
      );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const user = interaction.options.getUser("user", true);
      const reason =
        interaction.options.getString("reason", false) ||
        "No reason was provided.";
      await client.configurations.warns.create({
        guildId: interaction.guildId!,
        moderatorId: interaction.user.id,
        reason: `${reason}`,
        userId: user.id,
      });
      await interaction.reply({
        content: `✅`,
        ephemeral: true,
      });
      await interaction.channel?.send({
        content: `> ${user.toString()} has been warned for ${reason}`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
