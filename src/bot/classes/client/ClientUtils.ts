import { AttachmentBuilder, GuildMember, TextChannel } from "discord.js";
import DiscordClient from "./BaseClient";
import { IBirthdaySystem } from "../Database/Models/BirthdaySystemSchema";
class ClientUtils {
  client;
  constructor(client: DiscordClient<boolean>) {
    this.client = client;
  }
  formatString(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === "undefined") return "00:00";
    if (duration > 3600000000) return "Live";
    return this.convertTime(duration);
  }
  convertTime(duration: number) {
    let milliseconds = (duration % 1000) / 100,
      seconds: number | string = (duration / 1000) % 60,
      minutes: number | string = (duration / (1000 * 60)) % 60,
      hours: number | string = (duration / (1000 * 60 * 60)) % 24;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (duration < 3600000) {
      return minutes + ":" + seconds;
    } else {
      return hours + ":" + minutes + ":" + seconds;
    }
  }
  millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
    let h, m, s;
    h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
    m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);
    return `${h} Hours - ${m} Minutes - ${s} Secs`;
  };

  checkBirthdays = async () => {
    // Get the current date
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Fetch users with birthday today from the database
    const users = await this.client.database.models.usersBirthdays.find({
      day: currentDay,
      month: currentMonth,
      lastWishTime: { $ne: currentDate.toLocaleDateString() },
    });
    for (const user of users) {
      // Fetch server settings from the database based on server ID
      const serverSettings: IBirthdaySystem | null =
        await this.client.database.models.birthdaySystem.findOne({
          serverId: user.guildId,
        });
      if (serverSettings && serverSettings.birthdayEnabled) {
        const birthdayChannel: TextChannel | null =
          this.client.channels.cache.get(
            serverSettings.birthdayChannel!
          ) as TextChannel;

        if (birthdayChannel) {
          // Calculate age if year is provided
          let age = "";
          if (user.year) {
            age = serverSettings.yearMessage.replaceAll(
              "{age}",
              `${currentYear - user.year}`
            );
          }

          // Send birthday wishes to the user
          const birthdayMessage = serverSettings.birthdayMessage.replace(
            "{user}",
            `<@${user.discordId}>`
          );
          birthdayChannel.send(`${birthdayMessage}${age}`);
          // Update the lastWishTime for the user
          user.lastWishTime = currentDate.toLocaleDateString();
          await user.save();
        }
      }
    }
  };
}

export default ClientUtils;
