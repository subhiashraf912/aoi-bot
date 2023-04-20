import BaseEvent from "../classes/bases/BaseEvent";
import { GuildMember } from "discord.js";
import DiscordClient from "../classes/client/BaseClient";
import assignUserJoinRoles from "../functions/assignUserJoinRoles";
import sendWelcomeAttachment from "../functions/sendWelcomeAttachment";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("guildMemberAdd");
  }

  async run(client: DiscordClient<boolean>, member: GuildMember) {
    try {
      await assignUserJoinRoles(client, member);
    } catch (e) {
      console.log(e);
    }
    try {
      await sendWelcomeAttachment(client, member);
    } catch (e) {
      console.log(e);
    }
  }
}
