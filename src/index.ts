import "./bot/utils/enviorment";
import { ShardingManager } from "discord.js";
const { BOT_TOKEN } = process.env;

const manager = new ShardingManager("./dist/bot/index.js", {
  token: BOT_TOKEN,
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
