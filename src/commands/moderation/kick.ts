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
      name: "kick",
      description: "Kicks a member in the server.",
    });
    this.slashCommandBuilder
      .addUserOption((option) =>
        option
          .setName("user")
          .setRequired(true)
          .setDescription("The member you want to kick")
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setRequired(false)
          .setDescription("Provide a reason for banning this member.")
      )

      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    const member = interaction.options.getMember("user") as GuildMember;

    if (member.id === interaction.user.id) {
      interaction.reply({ content: "You can't kick yourself." });
      return;
    }
    const reason =
      interaction.options.get("reason")?.value || "No reason was provided";

    try {
      if (member)
        if (member.kickable) {
          await member.kick(
            `Responsible user: ${interaction.user.tag}\nReason: ${reason}`
          );
          await interaction.reply({
            content: `${member.toString()} has been kicked sucessfully.`,
          });
        } else
          await interaction.reply({ content: "This member is not kickable." });
      else await interaction.reply({ content: "Could not find that member." });
    } catch (err: any) {
      interaction.reply({ content: err.message, ephemeral: true });
    }
  }
}
