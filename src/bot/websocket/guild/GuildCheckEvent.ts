import BaseWebSocketEvent from "../../classes/bases/BaseWebsocketEvent";
import DiscordClient from "../../classes/client/BaseClient";

interface GuildCheckData {
  id: string;
  user: {
    id: string;
    discordId: string;
    accessToken: string;
    accessTokenExpiration: string;
    refreshToken: string;
  };
  eventUUID: string;
}

interface GuildCheckResult {
  success: boolean;
  message?: string;
}

export default class GuildCheckEvent extends BaseWebSocketEvent {
  constructor() {
    super("guildCheck");
  }

  async run(
    client: DiscordClient<boolean>,
    data: GuildCheckData,
    ack: (data: GuildCheckResult) => void
  ) {
    const { id, user, eventUUID } = data;

    const guild = client.guilds.cache.get(id);

    if (!guild) {
      ack({
        success: false,
        message: "Guild not found.",
      });
      return;
    }

    const member = await guild.members.fetch(user.discordId);
    if (!member) {
      ack({
        success: false,
        message: "You are not a member of this guild.",
      });
      return;
    }

    // Check if the member has the required permissions
    if (!member.permissions.has("ManageGuild")) {
      ack({
        success: false,
        message: "You do not have the required permissions.",
      });
      return;
    }

    // Call the "ack" function with success
    ack({
      success: true,
    });
  }
}
