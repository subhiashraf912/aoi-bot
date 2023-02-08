import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class PlayShuffleSubCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "shuffle",
      baseCommand: "music",
      group: "play",
      description: "Plays a song and shuffles the queue at the same time!",
    });
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    interaction.reply({ content: "Music play shuffle subcommand!" });
  }
}
