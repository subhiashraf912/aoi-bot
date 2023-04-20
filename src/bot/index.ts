import "./utils/enviorment";
import { IntentsBitField, Partials } from "discord.js";
import Client from "./classes/client/BaseClient";
import { clientRegistry } from "./utils/registry";
import "./utils/@types/environment";

const { BOT_TOKEN } = process.env;
const client = new Client({
  intents: [
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.AutoModerationConfiguration,
    IntentsBitField.Flags.AutoModerationExecution,
  ],
  partials: [
    Partials.Channel,
    Partials.User,
    Partials.GuildMember,
    Partials.Message,
  ],
  rest: { version: "10" },
});
client.rest.setToken(BOT_TOKEN);

async function main() {
  try {
    await clientRegistry(client);
    await client.login(BOT_TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();
