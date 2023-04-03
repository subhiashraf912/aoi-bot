import { Snowflake } from "discord.js";

interface Warn {
  guildId: Snowflake;
  userId: Snowflake;
  reason: string;
  id: string;
  moderatorId: Snowflake;
}

export default Warn;
