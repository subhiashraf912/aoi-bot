import BaseWebSocketEvent from "../../classes/bases/BaseWebsocketEvent";
import DiscordClient from "../../classes/client/BaseClient";

interface IBackendUser {
  id: string;
  discordId: string;
  accessToken: string;
  accessTokenExpiration: string;
  refreshToken: string;
}

interface GuildCheckResult {
  success: boolean;
  message?: string;
}

interface WelcomeSystemUpdateData {
  user: IBackendUser;
  enabled: boolean;
  channelId: string | null;
  content: string | null;
  sendAttachment: boolean;
  guildId: string;
}
export default class GuildCheckEvent extends BaseWebSocketEvent {
  constructor() {
    super("welcomeSystemUpdate");
  }

  async run(
    client: DiscordClient<boolean>,
    data: WelcomeSystemUpdateData,
    ack: (data: GuildCheckResult) => void
  ) {
    const { user, channelId, content, enabled, guildId, sendAttachment } = data;
    console.log(data);
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      console.log("Guild not found");
      ack({
        success: false,
        message: "Guild not found.",
      });
      return;
    }

    const member = await guild.members.fetch(user.discordId);
    if (!member) {
      console.log("You are not a member of this guild.");
      ack({
        success: false,
        message: "You are not a member of this guild.",
      });
      return;
    }

    // Check if the member has the required permissions
    if (!member.permissions.has("ManageGuild")) {
      console.log(`You do not have the required permissions.`);
      ack({
        success: false,
        message: "You do not have the required permissions.",
      });
      return;
    }
    // Update the welcome system
    let welcomeSystem = await client.database.models.welcomeSystem.findOne({
      guildId,
    });
    console.log("Looking for welcome system");
    if (!welcomeSystem) {
      welcomeSystem = await client.database.models.welcomeSystem.create({
        guildId,
        channelId,
        content,
        sendAttachment,
        enabled,
      });
      console.log("Created welcome system");
    } else {
      welcomeSystem.sendAttachment = enabled;
      welcomeSystem.channelId = channelId;
      welcomeSystem.content =
        content || "Welcome to {guildName}, {member-mention}!";
      welcomeSystem.sendAttachment = sendAttachment;
      welcomeSystem.enabled = enabled;
      console.log("Updated welcome system");
      await welcomeSystem.save();
    }
    // Call the "ack" function with success
    ack({
      success: true,
      message: "Welcome system updated.",
    });
  }
}
