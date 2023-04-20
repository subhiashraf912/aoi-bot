import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class DeleteWelcomeChannelCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "delete",
      baseCommand: "welcomer",
      description: "Delete the welcome channel for the server",
      group: "channel",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const guildId = interaction.guildId!;
    const welcomeSystem =
      await client.database.models.welcomeSystem.findOneAndUpdate(
        { guildId },
        { channelId: null }
      );

    if (!welcomeSystem) {
      await interaction.reply("There is no welcome channel to delete.");
    } else {
      await interaction.reply("Welcome channel deleted.");
    }
  }
}
