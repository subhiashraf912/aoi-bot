import mongoose from "mongoose";
import VoiceLevelsChannelsConfiguration from "../../../utils/@types/VoiceLevelsChannelsConfiguration";
const VoiceLevelChannelsSchema =
  new mongoose.Schema<VoiceLevelsChannelsConfiguration>({
    guildId: String,
    channels: {
      default: [],
    },
  });

export default mongoose.model<VoiceLevelsChannelsConfiguration>(
  "VoiceLevelChannels",
  VoiceLevelChannelsSchema,
  "VoiceLevelChannels"
);
