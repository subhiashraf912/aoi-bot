// websocket/connectEvent.ts
import BaseWebSocketEvent from "../classes/bases/BaseWebsocketEvent";
import DiscordClient from "../classes/client/BaseClient";

export default class DisconnectEvent extends BaseWebSocketEvent {
  constructor() {
    super("disconnect");
  }

  public async run(client: DiscordClient<boolean>) {
    console.log("Disconnected from the backend");
  }
}
