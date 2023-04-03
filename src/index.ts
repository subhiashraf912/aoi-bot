import "dotenv/config";
import { Partials } from "discord.js";
import Client from "./classes/client/BaseClient";
import { clientRegistry } from "./utils/registry";
import "./utils/@types/environment";

const { BOT_TOKEN } = process.env;
const client = new Client({
  intents: [
    "DirectMessages",
    "MessageContent",
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "GuildPresences",
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
