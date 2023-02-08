import * as dotenv from "dotenv";
dotenv.config();
import { Partials } from "discord.js";
import Client from "./classes/client/BaseClient";
import { clientRegistry } from "./utils/registry";
import "./utils/@types/environment";

const { BOT_TOKEN } = process.env;
const client = new Client({
  intents: ["DirectMessages", "MessageContent", "Guilds", "GuildMembers"],
  partials: [Partials.Channel, Partials.User, Partials.GuildMember],
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
