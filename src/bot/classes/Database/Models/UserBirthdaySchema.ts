import mongoose, { Document, Schema } from "mongoose";

// Define the interface for User Birthday
export interface IUserBirthday extends Document {
  discordId: string;
  day: number;
  month: number;
  year: number | null; // Store the year separately as a number or null
  guildId: string;
  lastWishTime: string | null;
}
// Define the User Birthday Schema
const UserBirthdaySchema = new Schema<IUserBirthday>({
  discordId: { type: String, required: true },
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, default: null }, // Store the year separately as a number or null
  guildId: { type: String, required: true },
  lastWishTime: { type: String, default: null },
});

const usersBirthdays = mongoose.model<IUserBirthday>(
  "UsersBirthdays",
  UserBirthdaySchema
);
export default usersBirthdays;
