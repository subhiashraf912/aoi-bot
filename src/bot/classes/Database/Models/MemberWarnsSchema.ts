import mongoose from "mongoose";
import MemberWarn from "../../../utils/@types/Warn";
import { v4 as uuidv4 } from "uuid";
const MemberWarnsSchema = new mongoose.Schema<MemberWarn>({
  guildId: String,
  userId: String,
  id: {
    type: String,
    required: true,
    default: uuidv4,
    unique: true,
  },
  moderatorId: String,
  reason: String,
});

export default mongoose.model<MemberWarn>(
  "MemberWarns",
  MemberWarnsSchema,
  "MemberWarns"
);
