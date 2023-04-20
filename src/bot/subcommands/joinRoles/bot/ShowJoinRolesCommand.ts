import {
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import DiscordClient from "../../../classes/client/BaseClient";
import { buttonPages } from "../../../utils/Pagination";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";

export default class ShowJoinRolesCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "show",
      description: "Displays the join roles list in a paginated format.",
      baseCommand: "joinroles",
      group: "bot",
    });
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const guildId = interaction.guildId!;
    const joinRolesConfig = await client.configurations.joinRoles.bot.get(
      guildId
    );

    if (!joinRolesConfig) {
      return interaction.reply({
        content: "There is no join roles system set up for this server.",
        ephemeral: true,
      });
    }

    const roles = joinRolesConfig.roles.map((role) => role.toString());

    const maxRolesPerPage = 10;
    const pages = generateRolesEmbeds({
      roles,
      maxRolesPerPage,
      title: "Join Roles List",
    });

    await buttonPages(interaction, pages);
  }
}

function generateRolesEmbeds({
  roles,
  maxRolesPerPage,
  title,
}: {
  roles: string[];
  maxRolesPerPage: number;
  title: string;
}): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = [];
  const pageCount = Math.ceil(roles.length / maxRolesPerPage);
  for (let i = 0; i < pageCount; i++) {
    const embed = new EmbedBuilder().setTitle(title).setColor("Blue");
    const start = i * maxRolesPerPage;
    const end = start + maxRolesPerPage;
    const rolesChunk = roles.slice(start, end);
    const rolesList = rolesChunk.length
      ? rolesChunk.map((role) => `\`${role}\``).join(", ")
      : "No roles added yet.";
    embed.setDescription(rolesList);
    embed.setFooter({ text: `Page ${i + 1} of ${pageCount}` });
    embeds.push(embed);
  }
  return embeds;
}
