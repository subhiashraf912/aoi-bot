import { CacheType, CommandInteraction, TextChannel } from "discord.js";
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
    // if (!client.checkDevelopers(interaction.user.id)) {
    //   interaction.reply({
    //     content: "Only bot developers have access to this command.",
    //   });
    //   return;
    // }

    const content = interaction.options.get("content", true).value as string;
    const attachment = interaction.options.get("attachment")?.attachment;
    const contentt = `> User ${interaction.user.toString()} has used the command \`say\` in: ${
      interaction.guild?.name || "BOT DMs"
    }
=========================================================================================
${content}
        `;

    try {
      const logsChannel = (await client.channels.fetch(
        "1086187113973829695"
      )) as TextChannel;
      if (attachment) {
        await interaction.channel!.send({
          content,
          files: [{ attachment: attachment.url }],
        });
        await logsChannel.send({
          content: contentt,
          files: [{ attachment: attachment.url }],
        });
      } else {
        await interaction.channel!.send({ content });
        await logsChannel.send({
          content: contentt,
        });
      }
      await interaction.reply({
        content: "Your message has been sent succesfully!",
        ephemeral: true,
      });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
