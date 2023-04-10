import BaseEvent from "../classes/bases/BaseEvent";
import { ActivityType, AutoModerationActionType } from "discord.js";
import DiscordClient from "../classes/client/BaseClient";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("ready");
  }

  async run(client: DiscordClient<true>) {
    console.log(`Client: ${client.user.username} is ready.`);

    // client.guilds.cache.get('790786331580170241')?.autoModerationRules.create({
    //   name: "test",
    //   actions: [{ type: AutoModerationActionType.BlockMessage }],
    //   eventType: 1,
    //   triggerType: 3,
    //   enabled: true,
    //   reason: "test"
    // });
    client.user?.setActivity({
      name: "/help and Aoi's lumine's build",
      type: ActivityType.Watching,
    });
  }
}
