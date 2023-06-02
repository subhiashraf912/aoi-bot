import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../classes/client/BaseClient";

export default class ToggleWelcomerAttachmentCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "toggle-attachment",
      baseCommand: "welcomer",
      description:
        "Enable or disable sending attachments with the welcome message",
    });
    this.commandBuilder.addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription(
          "Whether to enable or disable sending attachments with the welcome message"
        )
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const enabled = interaction.options.getBoolean("enabled", true);
    const guildId = interaction.guildId!;

    let welcomeSystem = await client.database.models.welcomeSystem.findOne({
      guildId,
    });

    if (!welcomeSystem) {
      welcomeSystem = await client.database.models.welcomeSystem.create({
        guildId,
        channelId: null,
        content: "Welcome to the server, {member}!",
        sendAttachment: enabled,
        enabled: true,
      });
    } else {
      welcomeSystem.sendAttachment = enabled;
      await welcomeSystem.save();
    }
    const status = enabled ? "enabled" : "disabled";

    await interaction.reply(
      `Sending attachments with the welcome message is now ${status}.`
    );
  }
}
