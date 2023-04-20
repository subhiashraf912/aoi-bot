import mongoose, { Document } from "mongoose";

// Define the ServerSettings interface
export interface IBirthdaySystem extends Document {
  serverId: string;
  birthdayMessage: string;
  birthdayChannel: string | null;
  birthdayEnabled: boolean;
  yearMessage: string;
}

// Define the ServerSettings schema
const birthdaySystemSchema = new mongoose.Schema<IBirthdaySystem>({
  serverId: { type: String, required: true },
  birthdayMessage: { type: String, default: "Happy birthday {user}! 🎉🎂" },
  birthdayChannel: { type: String, default: null },
  birthdayEnabled: { type: Boolean, default: true },
  yearMessage: { type: String, default: ", you are now {age} years old!" },
});

const BirthdaySystem = mongoose.model<IBirthdaySystem>(
  "BirthdaySystem",
  birthdaySystemSchema
);

export default BirthdaySystem;
