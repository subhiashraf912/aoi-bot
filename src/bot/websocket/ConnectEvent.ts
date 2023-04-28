// websocket/connectEvent.ts
import BaseWebSocketEvent from "../classes/bases/BaseWebsocketEvent";
import DiscordClient from "../classes/client/BaseClient";

export default class ConnectEvent extends BaseWebSocketEvent {
  constructor() {
    super("connect");
  }

  public async run(client: DiscordClient<boolean>, data: any) {
    console.log("Connected to the backend");
  }
}
