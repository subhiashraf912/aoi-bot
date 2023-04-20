import {
  Awaitable,
  CommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import SubCommandExecutorOptions from "../../utils/@types/SubCommandExecutorOptions";
import DiscordClient from "../client/BaseClient";

export default abstract class BaseSubCommandExecutor {
  private _baseCommand: string;
  private _group: string | null;
  private _name: string;
  private _description: string;
  private _commandBuilder = new SlashCommandSubcommandBuilder();
  constructor(options: SubCommandExecutorOptions) {
    this._baseCommand = options.baseCommand;
    this._group = options.group || null;
    this._name = options.name;
    this._description = options.description;
    this.commandBuilder.setName(this.name).setDescription(this.description);
  }
  get baseCommand() {
    return this._baseCommand;
  }
  get group() {
    return this._group;
  }
  get name() {
    return this._name;
  }
  get commandBuilder() {
    return this._commandBuilder;
  }
  get description() {
    return this._description;
  }
  getSlashCommandJSON() {
    return this.commandBuilder.toJSON();
  }
  abstract run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction
  ): Awaitable<any>;
}
