import mongoose from "mongoose";
import TextLevelsChannelsConfiguration from "../../../utils/@types/TextLevelsChannelsConfiguration";
const TextLevelChannelsSchema =
  new mongoose.Schema<TextLevelsChannelsConfiguration>({
    guildId: String,
    channels: Array,
  });

export default mongoose.model<TextLevelsChannelsConfiguration>(
  "TextLevelChannels",
  TextLevelChannelsSchema,
  "TextLevelChannels"
);
