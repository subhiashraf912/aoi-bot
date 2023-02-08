import { Snowflake } from "discord.js";
import TextLevelsRolesConfiguration from "../../../utils/@types/TextLevelRolesConfiguration";
import BaseManager from "../../bases/BaseManager";
import DiscordClient from "../../client/BaseClient";

export default class TextLevelRolesManager extends BaseManager<TextLevelsRolesConfiguration> {
  constructor(client: DiscordClient<true>) {
    super(client);
  }
  async create(data: TextLevelsRolesConfiguration) {
    const configuration =
      await this.client.database.models.textLevelRoles.create(data);
    this.cache.set(data.guildId, configuration);
    return configuration;
  }
  async update(data: TextLevelsRolesConfiguration) {
    let configuration =
      await this.client.database.models.textLevelRoles.findOneAndUpdate(
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
  async get(guildId: Snowflake): Promise<TextLevelsRolesConfiguration> {
    const cachedConfiguration = this.cache.get(guildId);
    if (cachedConfiguration) return cachedConfiguration;
    else return await this.fetch(guildId);
  }
  async fetch(guildId: Snowflake) {
    let configuration =
      await this.client.database.models.textLevelRoles.findOne({
        guildId,
      });
    if (!configuration)
      configuration = await this.create({ guildId, roles: {} });
    this.cache.set(guildId, configuration);
    return configuration;
  }
}
