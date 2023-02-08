import { PermissionResolvable } from "discord.js";

interface PermissionsGuardOptions {
  botPermissions: PermissionResolvable[];
  userPermissions: PermissionResolvable[];
}

export default PermissionsGuardOptions;
