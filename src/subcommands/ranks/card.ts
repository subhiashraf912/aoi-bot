import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../classes/client/BaseClient";

export default class RankCardCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "card",
      baseCommand: "rank",
      description: "Shows the member's rank card!",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const member = await interaction.guild?.members.fetch(
      interaction.member?.user.id!
    );
    const attachment = await client.utils.generateRankCard(member!);
    await interaction.reply({
      files: [attachment],
    });
  }
}
