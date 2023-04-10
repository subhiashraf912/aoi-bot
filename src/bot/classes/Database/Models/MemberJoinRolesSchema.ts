import mongoose from "mongoose";
import MemberJoinRolesRestOptions from "../../../utils/@types/MemberJoinRolesRestOptions";
const MemberJoinRolesSchema = new mongoose.Schema({
  guildId: String,
  roles: Array,
});

export default mongoose.model<MemberJoinRolesRestOptions>(
  "MemberJoinRoles",
  MemberJoinRolesSchema,
  "MemberJoinRoles"
);
