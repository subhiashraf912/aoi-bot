import { ChatInputCommandInteraction, GuildMember, Role } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class RoleCreateCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "delete",
      baseCommand: "role",
      description: "Deletes a role from the server",
    });
    this.commandBuilder.addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to delete!")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const role = interaction.options.getRole("role", true);

    const reason = `Responsible user: ${
      (interaction.member as GuildMember).user.tag
    }`;

    try {
      await (role as Role).delete(reason);
      await interaction.reply({
        content: `The role ${role.name} has been deleted.`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
