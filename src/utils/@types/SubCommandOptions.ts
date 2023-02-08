import { SlashCommandSubcommandBuilder } from "discord.js";

export interface Group {
  name: string;
  subCommands: SlashCommandSubcommandBuilder[];
  description: string;
}
export default interface SubCommandOptions {
  name: string;
  groups?: Group[];
  subCommands: SlashCommandSubcommandBuilder[];
  description: string;
}
