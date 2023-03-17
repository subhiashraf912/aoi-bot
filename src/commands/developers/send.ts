import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
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
    const user = interaction.options.get("user", true).user!;
    const content = interaction.options.get("content", true).value as string;
    const attachment = interaction.options.get("attachment")?.attachment;
    const contentt = `> User ${interaction.user.toString()} has used the command \`send\` in: ${
      interaction.guild?.name || "BOT DMs"
    }\n> To the user ${user.toString()}
        =========================================================================================
        ${content}
        `;
    const logsChannel = (await client.channels.fetch(
      "1086187113973829695"
    )) as TextChannel;
    try {
      if (attachment) {
        await user.send({
          content,
          files: [{ attachment: attachment.url }],
        });
        logsChannel.send({
          content: contentt,
          files: [{ attachment: attachment.url }],
        });
      } else await user.send({ content });
      {
        interaction.reply({
          content: "Your message has been sent succesfully!",
          ephemeral: true,
        });
        logsChannel.send({
          content: contentt,
        });
      }
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
