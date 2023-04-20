import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";
import { IUserBirthday } from "../../../classes/Database/Models/UserBirthdaySchema";

export default class BirthdaySetCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "set",
      baseCommand: "birthday",
      description: "Sets a birthday for the user.",
    });
    this.commandBuilder
      .addIntegerOption((option) =>
        option
          .setName("day")
          .setDescription("The day of the month the user was born.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("month")
          .setDescription("The month the user was born.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("year")
          .setDescription("The year the user was born.")
          .setRequired(false)
      );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const userId = interaction.user.id;
      const day = interaction.options.getInteger("day", true);
      const month = interaction.options.getInteger("month", true);
      const year = interaction.options.getInteger("year");

      let birthday: string;
      if (year) {
        birthday = `${day}/${month}/${year}`;
      } else {
        birthday = `${day}/${month}`;
      }

      const guildId = interaction.guildId!;

      // Update or create the user's birthday
      const user =
        (await client.database.models.usersBirthdays.findOneAndUpdate(
          { discordId: userId, guildId },
          {
            day,
            month,
            year: year || null, // Store year as null if not provided
            guildId,
          },
          { upsert: true, new: true }
        )) as IUserBirthday; // Cast the result as IUserBirthday interface

      interaction.reply({
        content: `Birthday set for <@${userId}>: ${birthday}`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occurred: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
