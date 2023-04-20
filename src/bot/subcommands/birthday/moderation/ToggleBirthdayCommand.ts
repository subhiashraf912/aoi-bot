import { ChatInputCommandInteraction } from "discord.js";
import DiscordClient from "../../../classes/client/BaseClient";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import BirthdaySystem from "../../../classes/Database/Models/BirthdaySystemSchema";

export default class ToggleBirthdayCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "toggle",
      description: "Enable or disable the birthday system in the server.",
      baseCommand: "set-birthday",
    });
    this.commandBuilder.addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Whether to enable or disable the birthday system?")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const serverId = interaction.guildId;
    const enabled = interaction.options.getBoolean("enabled", true);

    const birthdaySystem = await BirthdaySystem.findOne({ serverId });

    if (enabled) {
      // If 'enabled' is true, enable the birthday system
      if (birthdaySystem) {
        // If the birthday system already exists, update its value
        await BirthdaySystem.findOneAndUpdate(
          { serverId },
          { birthdayMessagesEnabled: true }
        );
      } else {
        // If the birthday system doesn't exist, create a new one
        await BirthdaySystem.create({
          serverId,
          birthdayMessagesEnabled: true,
        });
      }
      await interaction.reply({
        content: "Birthday system has been enabled for this server.",
      });
    } else {
      // If 'enabled' is false, disable the birthday system
      if (birthdaySystem) {
        // If the birthday system exists, update its value
        await BirthdaySystem.findOneAndUpdate(
          { serverId },
          { birthdayMessagesEnabled: false }
        );
        await interaction.reply({
          content: "Birthday system has been disabled for this server.",
        });
      } else {
        // If the birthday system doesn't exist, reply with an error message
        await interaction.reply({
          content: "Birthday system is already disabled for this server.",
          ephemeral: true,
        });
      }
    }
  }
}
