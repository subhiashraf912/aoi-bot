import mongoose, { Document, Schema } from "mongoose";

interface IWelcomeSystem extends Document {
  channelId: string;
  guildId: string;
  content: string;
  sendAttachment: boolean;
  enabled: boolean;
}

const WelcomeSystemSchema: Schema = new Schema<IWelcomeSystem>({
  channelId: {
    type: String,
  },
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    default: "Welcome to {guildName}, {member-mention}!",
  },
  sendAttachment: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
    required: true,
  },
});

export default mongoose.model<IWelcomeSystem>(
  "WelcomeSystem",
  WelcomeSystemSchema
);
