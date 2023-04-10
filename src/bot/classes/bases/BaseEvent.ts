import { ClientEvents } from "discord.js";
import DiscordClient from "../client/BaseClient";

export default abstract class BaseEvent {
  private _name: string;
  constructor(private name: keyof ClientEvents) {
    this._name = name;
  }

  getName() {
    return this._name;
  }
  abstract run(client: DiscordClient<boolean>, ...args: any): void;
}
