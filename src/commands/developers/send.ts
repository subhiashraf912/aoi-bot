import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class StatsSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "send",
      description: "Sends a private message to someone's DMs",
    });
    this.slashCommandBuilder
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user you want the message to be sent to.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("content")
          .setRequired(true)
          .setDescription("The content you want to be sent!")
      );
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    if (!client.checkDevelopers(interaction.user.id)) {
      interaction.reply({
        content: "Only bot developers have access to this command.",
      });
      return;
    }
    const user = interaction.options.get("user", true).user!;
    const content = interaction.options.get("content", true).value as string;
    try {
      await user.send({ content });
      interaction.reply({
        content: "Your message has been sent succesfully!",
        ephemeral: true,
      });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
