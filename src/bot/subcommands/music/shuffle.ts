import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../classes/client/BaseClient";

export default class ShuffleSubcommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "shuffle",
      baseCommand: "music",
      description: "Shuffles a song from the queue!",
    });
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    interaction.reply({ content: "Music shuffle Subcommand!" });
  }
}
