import DiscordClient from "../../client/BaseClient";
import TextLevelsHandler from "./Handler";
import TextLevelChannelsManager from "./LevelChannels";
import TextLevelRanksManager from "./Ranks";
import TextLevelRolesManager from "./Roles";
import EnabledLevelingGuildsManager from "./EnabledLevelingGuilds";
export default class TextLevelsManager {
  client;
  channels;
  ranks;
  roles;
  handler;
  levelingGuilds;
  constructor(client: DiscordClient<boolean>) {
    this.client = client;
    this.channels = new TextLevelChannelsManager(this.client);
    this.ranks = new TextLevelRanksManager(this.client);
    this.roles = new TextLevelRolesManager(this.client);
    this.handler = new TextLevelsHandler(this.client);
    this.levelingGuilds = new EnabledLevelingGuildsManager(this.client);
  }
}
