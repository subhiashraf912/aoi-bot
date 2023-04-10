import DiscordClient from "../../client/BaseClient";
import VoiceLevelChannelsManager from "./LevelChannels";
import VoiceLevelRanksManager from "./Ranks";
import VoiceLevelRolesManager from "./Roles";

export default class VoiceLevelsManager {
  client;
  channels;
  ranks;
  roles;
  constructor(client: DiscordClient<true>) {
    this.client = client;
    this.channels = new VoiceLevelChannelsManager(this.client);
    this.ranks = new VoiceLevelRanksManager(this.client);
    this.roles = new VoiceLevelRolesManager(this.client);
  }
}
