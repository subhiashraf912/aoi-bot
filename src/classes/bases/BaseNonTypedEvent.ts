import DiscordClient from "../client/BaseClient";
export default abstract class BaseNonTypedEvent {
  private _name: string;
  constructor(private name: string) {
    this._name = name;
  }

  getName() {
    return this._name;
  }
  abstract run(client: DiscordClient<boolean>, ...args: any): void;
}
