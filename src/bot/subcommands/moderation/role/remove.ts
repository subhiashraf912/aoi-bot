import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class RoleGiveCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "remove",
      baseCommand: "role",
      description: "removes a specific role to a specific member!",
    });
    this.commandBuilder
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Mention the user you want to remove the role from!")
          .setRequired(true)
      )
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("Mention the role you want to remove from the user!")
          .setRequired(true)
      );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const member = interaction.options.getMember("user");
    const role = interaction.options.getRole("role", true);
    try {
      await (member as GuildMember).roles.remove(role.id);
      await interaction.reply({
        content: `${role.name} has been removed from the user: ${
          (member as GuildMember).user.tag
        } ✅`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
