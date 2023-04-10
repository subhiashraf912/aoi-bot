import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class DisableTextLevelsCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "disable",
      baseCommand: "levels",
      group: "text",
      description: "Disables the leveling system in the server.",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const currentConfig =
        await client.configurations.textLevels.levelingGuilds.get(
          interaction.guildId!
        );
      if (!currentConfig.enabled) {
        interaction.reply({
          content: "The leveling system is already disabled for this server!",
        });
        return;
      }
      await client.configurations.textLevels.levelingGuilds.update({
        enabled: false,
        guildId: interaction.guildId!,
      });
      await interaction.reply({
        content: "The leveling system has been disabled for this server!",
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
