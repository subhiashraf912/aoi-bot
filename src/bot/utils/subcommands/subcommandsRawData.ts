import { PermissionFlagsBits } from "discord.js";

interface subcommandData {
  [key: string]: slashCommandData;
}
interface slashCommandData {
  description?: string;
  permissions?: bigint;
  directCommands?: boolean;
}
const subcommandsGroupsRawData: subcommandData = {
  music: {
    description: "Music Commands!",
  },
  levels: {
    description: "The levelling system commands (management)!",
    directCommands: false,
    permissions: PermissionFlagsBits.ManageGuild,
  },
  ranks: {
    description: "The rank cards commands!",
    directCommands: false,
  },
};

const subcommandsRawData: subcommandData = {
  role: {
    description: "Role management commands!",
    permissions: PermissionFlagsBits.ManageRoles,
    directCommands: false,
  },
  channel: {
    description: "Channel Management Commands!",
    permissions: PermissionFlagsBits.ManageChannels,
    directCommands: false,
  },
  warn: {
    description: "Warn Management commands!",
    permissions: PermissionFlagsBits.KickMembers,
    directCommands: false,
  },
  "set-birthday": {
    description: "The birthday management commands!",
    directCommands: false,
    permissions: PermissionFlagsBits.ManageGuild,
  },
  birthday: {
    description: "The public(users) birthday commands!",
    directCommands: false,
  },
};

export { subcommandsGroupsRawData, subcommandsRawData };
