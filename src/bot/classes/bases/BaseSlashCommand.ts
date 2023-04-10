import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import CommandOptions from "../../utils/@types/CommandOptions";
export abstract class BaseSlashCommand {
  private _name: string;
  private _description: string;
  private _subCommands?: CommandOptions[];
  private _stringOptions?: SlashCommandStringOption[];
  private _slashCommandBuilder: SlashCommandBuilder;
  constructor(options: CommandOptions) {
    this._name = options.name;
    this._description = options.description;
    this._subCommands = options.subCommands;
    this._stringOptions = options.stringOptions;
    this._slashCommandBuilder = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
    if (this.subCommands) {
      this.subCommands.forEach((command) => {
        this._slashCommandBuilder.addSubcommand((subcommand) =>
          subcommand.setName(command.name).setDescription(command.description)
        );
      });
    }
  }

  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get subCommands() {
    return this._subCommands;
  }
  get stringOptions() {
    return this._stringOptions;
  }
  get slashCommandBuilder() {
    return this._slashCommandBuilder;
  }
  getSlashCommandJSON() {
    return this.slashCommandBuilder.toJSON();
  }

  abstract run(client: Client, interaction: CommandInteraction): Promise<void>;
}
