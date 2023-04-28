import DiscordClient from "../client/BaseClient";
export default abstract class BaseWebSocketEvent {
  private _name;
  constructor(private eventName: string) {
    this._name = eventName;
  }

  public get name(): string {
    return this._name;
  }

  abstract run(client: DiscordClient<boolean>, ...args: any): any;
}
