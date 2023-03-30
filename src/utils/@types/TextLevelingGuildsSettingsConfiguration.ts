import { Snowflake } from "discord.js";

interface TextLevelingGuildsSettingsConfiguration {
  enabled?: boolean;
  guildId: Snowflake;
  minXpPerMessage?: number;
  maxXpPerMessage?: number;
  levelUpMessageChannelId?: Snowflake | null;
  levelUpMessageContent?: string | null;
}

export default TextLevelingGuildsSettingsConfiguration;
