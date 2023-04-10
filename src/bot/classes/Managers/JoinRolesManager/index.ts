import DiscordClient from "../../client/BaseClient";
import BotJoinRolesManager from "./BotJoinRolesManager";
import MembersJoinRolesManager from "./MembersJoinRolesManager";

interface joinRoles {
  member: MembersJoinRolesManager;
  bot: BotJoinRolesManager;
}

class JoinRolesManager implements joinRoles {
  member;
  bot;
  constructor(client: DiscordClient<true>) {
    this.member = new MembersJoinRolesManager(client);
    this.bot = new BotJoinRolesManager(client);
  }
}

export default JoinRolesManager;
