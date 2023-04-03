import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class DeleteWarnCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "delete",
      baseCommand: "warn",
      description: "Deletes a warn from a specific user!",
    });
    this.commandBuilder.addStringOption((option) =>
      option
        .setName("warn-id")
        .setDescription(
          "Enter the warn ID here (user show warns command to get the id)"
        )
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const warnId = interaction.options.getString("warn-id", true);
      const result = await client.configurations.warns.delete({
        guildId: interaction.guildId!,
        id: warnId,
      });
      await interaction.reply({
        content: `The delete was ${result ? "successful" : "not successful."}`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
