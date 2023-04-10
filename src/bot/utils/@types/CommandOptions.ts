import { SlashCommandStringOption } from "discord.js";

export default interface CommandOptions {
  name: string;
  description: string;
  subCommands?: CommandOptions[];
  stringOptions?: SlashCommandStringOption[];
}
