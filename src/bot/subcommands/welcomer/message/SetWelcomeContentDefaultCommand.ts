import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class SetWelcomeContentDefaultCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "content-default",
      baseCommand: "welcomer",
      description: "Set the default welcome message for the server",
      group: "message",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const guildId = interaction.guildId!;

    let welcomeSystem = await client.database.models.welcomeSystem.findOne({
      guildId,
    });
    const content = "Welcome to {guildName}, {member-mention}!";

    if (!welcomeSystem) {
      welcomeSystem = await client.database.models.welcomeSystem.create({
        guildId,
        channelId: null,
        content,
        sendAttachment: false,
        enabled: true,
      });
    } else {
      welcomeSystem.content = content;
      await welcomeSystem.save();
    }

    await interaction.reply(
      `Default welcome message set to "${content}" for the server.`
    );
  }
}
