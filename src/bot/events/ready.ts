import BaseEvent from "../classes/bases/BaseEvent";
import { ActivityType } from "discord.js";
import DiscordClient from "../classes/client/BaseClient";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("ready");
  }

  async run(client: DiscordClient<true>) {
    console.log(`Client: ${client.user.username} is ready.`);
    // Schedule checking for birthdays every 5 hours
    setInterval(client.utils.checkBirthdays, 5 * 60 * 60 * 1000);

    client.user?.setActivity({
      name: "/help and Aoi's lumine's build",
      type: ActivityType.Watching,
    });
  }
}
