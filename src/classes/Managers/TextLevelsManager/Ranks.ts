import { Snowflake } from "discord.js";
import { isArray } from "util";
import TextLevelsRanksConfiguration from "../../../utils/@types/TextLevelsRanksConfiguration";
import BaseManager from "../../bases/BaseManager";
import DiscordClient from "../../client/BaseClient";
import TextLevelsRanksUpdateConfiguration from "../../../utils/@types/TextLevelsRanksUpdateConfiguration";

type searchDataType = {
  guildId: Snowflake;
  userId?: Snowflake;
};

export default class TextLevelRanksManager extends BaseManager<TextLevelsRanksConfiguration> {
  constructor(client: DiscordClient<true>) {
    super(client);
  }
  async create(data: TextLevelsRanksConfiguration) {
    const configuration =
      await this.client.database.models.textLevelRanks.create(data);
    this.cache.set(`${data.guildId}.${data.userId}`, configuration);
    return configuration;
  }
  async update(
    data: TextLevelsRanksUpdateConfiguration
  ): Promise<TextLevelsRanksConfiguration> {
    let configuration =
      await this.client.database.models.textLevelRanks.findOneAndUpdate(
        {
          guildId: data.guildId,
          userId: data.userId,
        },
        data,
        { new: true }
      );
    if (!configuration)
      configuration = await this.create({
        guildId: data.guildId,
        userId: data.userId,
        rankBackground: data.rankBackground || null,
        xp: data.xp || 0,
        lastMessage: data.lastMessage || Date.now(),
        level: data.level || 1,
      });
    this.cache.set(`${data.guildId}.${data.userId}`, configuration);
    return configuration;
  }
  async get(data: searchDataType): Promise<TextLevelsRanksConfiguration> {
    const cachedConfiguration = this.cache.get(
      `${data.guildId}.${data.userId}`
    );
    if (cachedConfiguration) return cachedConfiguration;
    else return (await this.fetch(data)) as TextLevelsRanksConfiguration;
  }
  async fetch(
    data: searchDataType
  ): Promise<TextLevelsRanksConfiguration | TextLevelsRanksConfiguration[]> {
    const { guildId, userId } = data;
    let configuration:
      | TextLevelsRanksConfiguration
      | TextLevelsRanksConfiguration[]
      | null;
    if (userId)
      configuration = await this.client.database.models.textLevelRanks.findOne(
        data
      );
    else
      configuration = await this.client.database.models.textLevelRanks.find(
        data
      );
    if (!configuration)
      configuration = await this.create({
        guildId,
        userId: userId!,
        lastMessage: Date.now(),
        level: 1,
        xp: 0,
        rankBackground: null,
      });
    if (isArray(configuration))
      configuration.forEach((el) => {
        this.cache.set(`${el.guildId}.${el.userId}`, el);
      });
    else
      this.cache.set(
        `${data.guildId}.${data.userId}`,
        configuration as TextLevelsRanksConfiguration
      );
    return configuration as TextLevelsRanksConfiguration;
  }
}
