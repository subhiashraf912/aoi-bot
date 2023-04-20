import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class UpcomingBirthdaysCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "upcoming",
      baseCommand: "birthday",
      description: "Lists the upcoming 10 birthdays in the server.",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      // Fetch server settings from the database based on server ID
      const serverSettings =
        await client.database.models.birthdaySystem.findOne({
          serverId: interaction.guildId!,
        });

      if (!serverSettings || !serverSettings.birthdayEnabled) {
        return interaction.reply(
          "Birthday system is not enabled in this server."
        );
      }

      // Fetch users with upcoming birthdays from the database
      const upcomingBirthdays = await client.database.models.usersBirthdays
        .find({
          guildId: interaction.guildId!,
          month: { $gte: new Date().getMonth() + 1 },
        })
        .sort({ month: 1, day: 1 })
        .limit(10);

      if (upcomingBirthdays.length === 0) {
        return interaction.reply("No upcoming birthdays found.");
      }

      // Create an embed to display upcoming birthdays
      const embed = new EmbedBuilder()
        .setTitle("Upcoming Birthdays")
        .setColor("#ffcc00");

      for (const user of upcomingBirthdays) {
        const { day, month, year } = user;
        let age = "";
        if (year) {
          age = `, ${new Date().getFullYear() - year} years old`;
        }
        const discordUser = client.users.cache.get(user.discordId);
        embed.addFields({
          name: `${discordUser?.username}#${discordUser?.tag}`,
          value: `Birthday: ${day}/${month}${age}`,
        });
      }

      // Send the embed
      interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "An error occurred.", ephemeral: true });
    }
  }
}
