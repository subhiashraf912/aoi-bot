import {
  CacheType,
  CommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class BanSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "ban",
      description: "Bans a member in the server.",
    });
    this.slashCommandBuilder
      .addUserOption((option) =>
        option
          .setName("user")
          .setRequired(true)
          .setDescription("The member you want to ban")
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setRequired(false)
          .setDescription("Provide a reason for banning this member.")
      )
      .addBooleanOption((option) =>
        option
          .setName("delete_messages")
          .setDescription("Delete the previous messages in the past 1 hour.")
          .setRequired(false)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    const member = interaction.options.getMember("user") as GuildMember;

    if (member.id === interaction.user.id) {
      interaction.reply({ content: "You can't ban yourself." });
      return;
    }
    const reason =
      interaction.options.get("reason")?.value || "No reason was provided";
    const deletePreviousMessages =
      (interaction.options.get("delete_messages", false)?.value as boolean) ||
      false;

    try {
      if (member)
        if (member.bannable) {
          await member.ban({
            deleteMessageSeconds: deletePreviousMessages ? 3600 : undefined,
            reason: `Responsible user: ${interaction.user.tag}\nReason: ${reason}`,
          });
          await interaction.reply({
            content: `${member.toString()} has been banned sucessfully.`,
          });
        } else
          await interaction.reply({ content: "This member is not bannable." });
      else await interaction.reply({ content: "Could not find that member." });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
