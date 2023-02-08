import { Snowflake } from "discord.js";
import VoiceLevelsChannelsConfiguration from "../../../utils/@types/VoiceLevelsChannelsConfiguration";
import BaseManager from "../../bases/BaseManager";
import DiscordClient from "../../client/BaseClient";

export default class VoiceLevelChannelsManager extends BaseManager<VoiceLevelsChannelsConfiguration> {
  constructor(client: DiscordClient<true>) {
    super(client);
  }
  async create(data: VoiceLevelsChannelsConfiguration) {
    const configuration =
      await this.client.database.models.voiceLevelChannels.create(data);
    this.cache.set(data.guildId, configuration);
    return configuration;
  }
  async update(data: VoiceLevelsChannelsConfiguration) {
    let configuration =
      await this.client.database.models.voiceLevelChannels.findOneAndUpdate(
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
  async get(guildId: Snowflake): Promise<VoiceLevelsChannelsConfiguration> {
    const cachedConfiguration = this.cache.get(guildId);
    if (cachedConfiguration) return cachedConfiguration;
    else return await this.fetch(guildId);
  }
  async fetch(guildId: Snowflake) {
    let configuration =
      await this.client.database.models.voiceLevelChannels.findOne({
        guildId,
      });
    if (!configuration)
      configuration = await this.create({ guildId, channels: [] });
    this.cache.set(guildId, configuration);
    return configuration;
  }
}
