import {
  CacheType,
  CommandInteraction,
  PermissionFlagsBits,
  PermissionsBitField,
} from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class NickSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "nick",
      description: "Changes the bot nickname!",
    });
    this.slashCommandBuilder
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription("The new nickname")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames);
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    await interaction.reply({ content: "Changing nickname..." });
    const newNickname = interaction.options.get("nickname", true);
    try {
      await interaction.guild?.members.me?.setNickname(
        newNickname.value?.toString()!
      );
      interaction.editReply({
        content: `Bot's nickname has been changed to: ${newNickname.value?.toString()}`,
      });
    } catch (err: any) {
      interaction.editReply({ content: err.message });
    }

    // interaction.reply({
    // content: `Bot's nickname has been changed to: ${newNickname}`,
    // });
  }
}
