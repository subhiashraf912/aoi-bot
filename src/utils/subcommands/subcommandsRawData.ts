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
};

export { subcommandsGroupsRawData, subcommandsRawData };
