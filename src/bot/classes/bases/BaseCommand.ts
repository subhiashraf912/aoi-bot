import { Message } from "discord.js";
import DiscordClient from "../client/BaseClient";
import TextCommandOptions from "../../utils/@types/TextCommandOptions";
export default abstract class BaseCommand {
  name;
  category;
  aliases;
  description;
  usage;
  permissions;
  constructor(private options: TextCommandOptions) {
    this.name = options.name;
    this.category = options.category;
    this.aliases = options.aliases || [];
    this.description = options.description || "No description for this command";
    this.usage = options.usage || "No usage for this command";
    this.permissions = options.permissions;
  }

  abstract run(
    client: DiscordClient<boolean>,
    message: Message,
    args: string[] | null
  ): Promise<any>;
}
