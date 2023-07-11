import {
  CacheType,
  ChatInputCommandInteraction,
  CommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class HelpSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "set-nickname",
      description: "Sets the nickname for a user!",
    });
    this.slashCommandBuilder
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription(
            "The user to change the nickname of. Defaults to the user who ran the command."
          )
      )
      .addStringOption((option) =>
        option
          .setName("nickname")
          .setDescription("The new nickname. Defaults to the user's username.")
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames);
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    try {
      const newNickname = interaction.options.getString("nickname"); // Assumes 'nickname' is the new nickname
      const member: GuildMember = (interaction.options.getMember("user") ||
        interaction.member!) as GuildMember; // Assumes 'user' is the user to change the nickname of

      await member.setNickname(newNickname);

      interaction.reply({
        content: `${member.user.username}'s nickname has been ${
          newNickname ? `changed to: ${newNickname}` : "cleared."
        }`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `I got an error while changing the nickname: ${err.message}`,
      });
    }
  }
}
