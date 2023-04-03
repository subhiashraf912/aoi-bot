import { Snowflake } from "discord.js";
import BaseManager from "../../bases/BaseManager";
import DiscordClient from "../../client/BaseClient";
import Warn from "../../../utils/@types/Warn";

type WarnModificationData = Partial<Warn> & {
  guildId: Snowflake;
  userId: Snowflake;
};

type WarnParamsWithoutId = Pick<
  Warn,
  "guildId" | "userId" | "reason" | "moderatorId"
>;

type WarnParamsWithOptionalId = WarnParamsWithoutId & {
  id?: string; // Add `id` with the optional modifier using the `?` operator
};
class WarnsManager extends BaseManager<Warn> {
  constructor(client: DiscordClient<true>) {
    super(client);
  }

  async create(warn: WarnParamsWithOptionalId): Promise<Warn> {
    const configuration = await this.client.database.models.warns.create(warn);
    this.cache.set(configuration.id, configuration);
    return configuration;
  }
  async update(
    warn: WarnModificationData,
    updatedData: Partial<Warn>
  ): Promise<Warn> {
    let configuration: Warn | null =
      await this.client.database.models.warns.findOneAndUpdate(
        warn,
        { $set: updatedData },
        {
          new: true,
        }
      );
    if (!configuration) throw new Error("The warn does not exist");
    this.cache.set(configuration.id, configuration);
    return configuration;
  }
  async delete(key: Partial<Warn>) {
    const data = await this.get(key);
    if (!data) throw new Error("The warn does not exist.");
    const result = await this.client.database.models.warns.deleteOne(key);
    this.cache.delete(data.id);
    return result.deletedCount === 1;
  }
  async get(key: Partial<Warn>): Promise<Warn | undefined> {
    let foundWarn: Warn | undefined;
    this.cache.forEach((warn) => {
      let found = true;
      Object.keys(warn).forEach((k) => {
        if (warn[k as keyof Warn] === key[k as keyof Warn]) {
          found = false;
        }
      });
      if (found) {
        foundWarn = warn;
      }
    });
    if (!foundWarn) {
      foundWarn = await this.fetch(key);
    }
    return foundWarn;
  }
  async fetch(warn: Partial<Warn>) {
    let configuration: Warn | null =
      await this.client.database.models.warns.findOne(warn);
    if (!configuration) return;
    this.cache.set(configuration.id, configuration);
    return configuration;
  }

  async getAllWarns(key: Partial<Warn>): Promise<Warn[]> {
    const data = await this.client.database.models.warns.find(key);
    data.forEach((warn) => {
      this.cache.set(warn.id, warn);
    });
    return data;
  }
}

export default WarnsManager;
