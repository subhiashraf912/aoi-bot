import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class BirthdayForgetCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "forget",
      baseCommand: "birthday",
      description: "Forget the birthday for the user.",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const userId = interaction.user.id;

      // Forget the birthday for the user
      const user = await client.database.models.usersBirthdays.findOneAndDelete(
        { discordId: userId, guildId: interaction.guildId! }
      );

      if (user) {
        interaction.reply({ content: `Birthday forgotten for <@${userId}>.` });
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
