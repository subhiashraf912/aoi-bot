import {
  Client,
  ClientEvents,
  ClientOptions,
  Collection,
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

import { BaseSlashCommand } from "../bases/BaseSlashCommand";
import BaseEvent from "../bases/BaseEvent";
import BaseCommand from "../bases/BaseCommand";
import ClientConfiguration from "./ClientConfigurationsManager";
import Database from "../Database/Database";
import BaseSubCommandExecutor from "../bases/BaseSubCommandExecutor";
import { Configuration, OpenAIApi } from "openai";
import ClientUtils from "./ClientUtils";

interface SubcommandsGroup {
  name: string;
  baseCommand: string;
  builder: SlashCommandSubcommandGroupBuilder;
  registeredCommands: string[];
}

export default class DiscordClient<
  Ready extends boolean
> extends Client<Ready> {
  constructor(options: ClientOptions) {
    super(options);
  }
  prefix = "!";
  openai = new OpenAIApi(
    new Configuration({
      organization: process.env.OPENAI_ORGANIZATION,
      apiKey: process.env.OPENAI_KEY,
    })
  );

  utils: ClientUtils = new ClientUtils(this);
  database = new Database(process.env.MONGO_DB!);
  slashCommands = new Collection<string, BaseSlashCommand>();
  events = new Collection<keyof ClientEvents, BaseEvent>();
  commands = new Collection<string, BaseCommand>();
  subcommandsGroups = new Collection<string, SubcommandsGroup>();
  subcommandsBuilders = new Collection<string, SlashCommandBuilder>();
  subcommands = new Collection<string, BaseSubCommandExecutor>();
  lastUserUsingSendCommand: string | null = null;
  aliases = new Collection<string, string>();
  configurations: ClientConfiguration = new ClientConfiguration(this);
  developers = ["805422315538087936", "507684120739184640"];

  checkDevelopers(userId: string) {
    return this.developers.includes(userId);
  }
}
