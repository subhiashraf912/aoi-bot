import {
  CacheType,
  CommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";
import sendWelcomeAttachment from "../../functions/sendWelcomeAttachment";

export default class TestWelcomeCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "test-welcome",
      description: "Sends the welcome thing in the chat.",
    });
    this.slashCommandBuilder.setDMPermission(false);
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member) {
      interaction.reply({ content: "Member not found.", ephemeral: true });
      return;
    }
    try {
      await sendWelcomeAttachment(client, member);
      await interaction.reply({ content: "Done." });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
