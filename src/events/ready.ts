import BaseEvent from "../classes/bases/BaseEvent";
import { ActivityType } from "discord.js";
import DiscordClient from "../classes/client/BaseClient";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("ready");
  }

  async run(client: DiscordClient<true>) {
    console.log(`Client: ${client.user.username} is ready.`);
    client.user?.setActivity({
      name: "/help and Aoi's lumine's build",
      type: ActivityType.Watching,
    });
  }
}
