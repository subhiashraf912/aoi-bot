import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../classes/client/BaseClient";

export default class RankCardCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "set",
      baseCommand: "rank",
      group: "background",
      description: "Shows the member's rank card!",
    });
    this.commandBuilder.addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("Upload the background you want,")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    interaction.reply({ content: "> Updating your rank background..." });
    const attachment = interaction.options.getAttachment("attachment", true);
    const attachmentsChannel = await client.channels.fetch(
      "1092124871837896835",
      { allowUnknownGuild: true }
    );
    if (attachmentsChannel?.isTextBased()) {
      const file = await attachmentsChannel.send({
        content: `Rank Background for the user: ${interaction.member?.toString()}`,
        files: [attachment],
      });
      const url = file.attachments.first()?.url!;

      await client.configurations.textLevels.ranks.update({
        guildId: interaction.guildId!,
        userId: interaction.user.id,
        rankBackground: url,
      });

      await interaction.editReply({
        content: "> Your rank background has been set to:",
        files: [attachment],
      });
    }
  }
}
