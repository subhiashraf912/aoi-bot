import {
  GuildCountersManager,
  JoinRolesManager,
  PrefixesManager,
  TextLevelsManager,
  VoiceLevelsManager,
  WarnsManager,
  WelcomesManager,
} from "../Managers";
import DiscordClient from "./BaseClient";
class ClientConfiguration {
  private client: DiscordClient<boolean>;
  prefixes;
  welcomes;
  voiceLevels;
  textLevels;
  joinRoles;
  guildCounters;
  warns;
  constructor(client: DiscordClient<boolean>) {
    this.client = client;
    this.prefixes = new PrefixesManager(this.client);
    this.welcomes = new WelcomesManager(this.client);
    this.voiceLevels = new VoiceLevelsManager(this.client);
    this.textLevels = new TextLevelsManager(this.client);
    this.joinRoles = new JoinRolesManager(this.client);
    this.guildCounters = new GuildCountersManager(this.client);
    this.warns = new WarnsManager(client);
  }
}

export default ClientConfiguration;
