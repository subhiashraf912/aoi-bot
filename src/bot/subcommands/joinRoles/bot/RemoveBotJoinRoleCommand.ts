import { ChatInputCommandInteraction, GuildMember, Role } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class RemoveJoinRoleCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "remove",
      baseCommand: "joinroles",
      description: "Remove a role from the join roles list",
      group: "bot",
    });
    this.commandBuilder.addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to remove from the join roles list")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const role = interaction.options.getRole("role", true) as Role;
    const joinRolesManager = client.configurations.joinRoles.bot;
    const guildId = interaction.guildId!;
    let configuration = await joinRolesManager.get(guildId);
    if (!configuration) {
      await interaction.reply(
        "There are no join roles set for this server yet."
      );
      return;
    } else {
      const newRoles = configuration.roles
        .map((r) => r.id)
        .filter((id) => id !== role.id);
      configuration = await joinRolesManager.update(guildId, {
        roles: newRoles,
      });
    }
    await interaction.reply(`Role ${role.name} removed from join roles list.`);
  }
}
