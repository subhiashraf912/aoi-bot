import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class RoleGiveCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "give",
      baseCommand: "role",
      description: "Adds a specific role to a specific member!",
    });
    this.commandBuilder
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Mention the user you want to add the role to!")
          .setRequired(true)
      )
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("Mention the role you want to add to the user!")
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
      await (member as GuildMember).roles.add(role.id);
      await interaction.reply({
        content: `${role.name} has been given to the user: ${
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
