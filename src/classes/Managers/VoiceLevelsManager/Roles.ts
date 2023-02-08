import { Snowflake } from "discord.js";
import VoiceLevelsRolesConfiguration from "../../../utils/@types/VoiceLevelRolesConfiguration";
import BaseManager from "../../bases/BaseManager";
import DiscordClient from "../../client/BaseClient";

export default class VoiceLevelRolesManager extends BaseManager<VoiceLevelsRolesConfiguration> {
  constructor(client: DiscordClient<true>) {
    super(client);
  }
  async create(data: VoiceLevelsRolesConfiguration) {
    const configuration =
      await this.client.database.models.voiceLevelRoles.create(data);
    this.cache.set(data.guildId, configuration);
    return configuration;
  }
  async update(data: VoiceLevelsRolesConfiguration) {
    let configuration =
      await this.client.database.models.voiceLevelRoles.findOneAndUpdate(
        {
          guildId: data.guildId,
        },
        data,
        { new: true }
      );
    if (!configuration) configuration = await this.create(data);
    this.cache.set(data.guildId, configuration);
    return configuration;
  }
  async get(guildId: Snowflake): Promise<VoiceLevelsRolesConfiguration> {
    const cachedConfiguration = this.cache.get(guildId);
    if (cachedConfiguration) return cachedConfiguration;
    else return await this.fetch(guildId);
  }
  async fetch(guildId: Snowflake) {
    let configuration =
      await this.client.database.models.voiceLevelRoles.findOne({
        guildId,
      });
    if (!configuration)
      configuration = await this.create({ guildId, roles: {} });
    this.cache.set(guildId, configuration);
    return configuration;
  }
}
