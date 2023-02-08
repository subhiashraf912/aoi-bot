import { PermissionFlagsBits } from "discord.js";

interface subcommandData {
  [key: string]: slashCommandData;
}
interface slashCommandData {
  description?: string;
  permissions?: bigint;
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
  },
};

export { subcommandsGroupsRawData, subcommandsRawData };
