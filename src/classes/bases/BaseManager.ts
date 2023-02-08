import { Collection, Snowflake } from "discord.js";
import DiscordClient from "../client/BaseClient";
export default abstract class BaseManager<T> {
  cache = new Collection<Snowflake, T>();
  client;
  constructor(client: DiscordClient<boolean>) {
    this.client = client;
  }
}
