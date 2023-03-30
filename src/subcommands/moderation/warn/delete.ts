import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class RoleCreateCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "delete",
      baseCommand: "warn",
      description: "Deletes a warn from a specific user!",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      await interaction.reply({
        content: `This is the delete warn command!`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
