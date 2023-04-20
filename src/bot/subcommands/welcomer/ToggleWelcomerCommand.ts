import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../classes/client/BaseClient";

export default class ToggleWelcomerCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "toggle",
      baseCommand: "welcomer",
      description:
        "Enable or disable the welcome message system for the server",
    });
    this.commandBuilder.addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether to enable or disable the system")
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
        sendAttachment: false,
        enabled,
      });
    } else {
      welcomeSystem.enabled = enabled;
      await welcomeSystem.save();
    }

    const status = enabled ? "enabled" : "disabled";

    await interaction.reply(
      `Welcome message system has been ${status} for the server.`
    );
  }
}
