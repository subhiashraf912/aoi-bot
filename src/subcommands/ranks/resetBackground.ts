import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../classes/client/BaseClient";

export default class RankCardCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "reset",
      baseCommand: "rank",
      group: "background",
      description: "Resets the member's rank card!",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    await client.configurations.textLevels.ranks.update({
      guildId: interaction.guildId!,
      userId: interaction.member?.user.id!,
      rankBackground: null,
    });

    await interaction.reply({
      content: "> Your rank background has been set to default.",
    });
  }
}
