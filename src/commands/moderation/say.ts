import { CacheType, CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class StatsSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "say",
      description: "Sends a message in the chat",
    });
    this.slashCommandBuilder
      .addStringOption((option) =>
        option
          .setName("content")
          .setRequired(true)
          .setDescription("The content you want to be sent!")
      )
      .addAttachmentOption((option) =>
        option
          .setName("attachment")
          .setDescription("If you want to send an attachment, send it here!")
      );
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    const content = interaction.options.get("content", true).value as string;
    const attachment = interaction.options.get("attachment")?.attachment;
    try {
      if (attachment)
        await interaction.channel!.send({
          content,
          files: [{ attachment: attachment.url }],
        });
      else await interaction.channel!.send({ content });
      await interaction.reply({
        content: "Your message has been sent succesfully!",
        ephemeral: true,
      });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
