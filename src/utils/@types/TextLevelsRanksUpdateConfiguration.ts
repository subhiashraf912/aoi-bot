import { Snowflake } from "discord.js";

interface TextLevelsRanksUpdateConfiguration {
  guildId: Snowflake;
  userId: Snowflake;
  level?: number;
  xp?: number;
  lastMessage?: number;
  rankBackground?: string | null;
}

export default TextLevelsRanksUpdateConfiguration;
