import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class SetWelcomeContentCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "content",
      baseCommand: "welcomer",
      description: "Set the welcome message content for the server",
      group: "message",
    });
    this.commandBuilder.addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The content you want to use for the welcome message")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const content = interaction.options.getString("content", true);

    const guildId = interaction.guildId!;
    let welcomeSystem = await client.database.models.welcomeSystem.findOne({
      guildId,
    });

    if (!welcomeSystem) {
      welcomeSystem = await client.database.models.welcomeSystem.create({
        guildId: guildId,
        channelId: null,
        content: content,
        sendAttachment: false,
        enabled: true,
      });
    } else {
      welcomeSystem.content = content;
      welcomeSystem.sendAttachment = false;
      await welcomeSystem.save();
    }

    await interaction.reply(
      `Welcome message content set to "${content}" without an attachment.`
    );
  }
}
