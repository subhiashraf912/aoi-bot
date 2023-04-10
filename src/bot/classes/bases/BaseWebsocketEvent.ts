import DiscordClient from "../client/BaseClient";
export default abstract class BaseWebSocketEvent {
  name;
  constructor(private eventName: string) {
    this.name = eventName;
  }

  abstract run(client: DiscordClient<boolean>, ...args: any): any;
}
