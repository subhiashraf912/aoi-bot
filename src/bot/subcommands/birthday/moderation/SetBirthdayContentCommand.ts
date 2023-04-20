import { ChatInputCommandInteraction } from "discord.js";
import DiscordClient from "../../../classes/client/BaseClient";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";

export default class SetBirthdayContentCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "content",
      description: "Change the birthday message content.",
      baseCommand: "set-birthday",
    });
    this.commandBuilder.addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The content of the birthday message.")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const content = interaction.options.getString("content");
      const userId = interaction.user.id;

      // Update the birthday message content for the user
      const user = await client.database.models.birthdaySystem.findOneAndUpdate(
        { serverId: interaction.guildId! },
        { birthdayMessage: content },
        { new: true }
      );

      if (user) {
        interaction.reply({
          content: `Birthday message content set for <@${userId}>: ${content}`,
        });
      } else {
        interaction.reply({
          content: "No birthday found for the user.",
          ephemeral: true,
        });
      }
    } catch (err: any) {
      interaction.reply({
        content: `Error occurred: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
