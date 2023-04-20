import { ChatInputCommandInteraction, Role } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class AddJoinRoleCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "add",
      baseCommand: "joinroles",
      description: "Add a role to the join roles list",
      group: "bot",
    });
    this.commandBuilder.addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to add to the join roles list")
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
      configuration = await joinRolesManager.create({
        guildId: guildId,
        roles: [role.id],
      });
    } else {
      const newRoles = configuration.roles.map((r) => r.id);
      newRoles.push(role.id);
      configuration = await joinRolesManager.update(guildId, {
        roles: newRoles,
      });
    }
    await interaction.reply(`Role ${role.name} added to join roles list.`);
  }
}
