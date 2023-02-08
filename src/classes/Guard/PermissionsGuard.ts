import { PermissionsBitField, PermissionResolvable } from "discord.js";
import PermissionsGuardOptions from "../../utils/@types/PermissionsGuardOptions";
class PermissionsGuard {
  userPermissions;
  botPermissions;
  constructor(options: PermissionsGuardOptions) {
    this.userPermissions = options.userPermissions;
    this.botPermissions = options.botPermissions;
  }

  checkMemberPermissions(memberPermissions: Readonly<PermissionsBitField>) {
    const missingPermissions: PermissionResolvable[] = [];
    this.userPermissions.forEach((perm) => {
      if (!memberPermissions.has(perm)) missingPermissions.push(perm);
    });
    return !missingPermissions[0] ? true : false;
  }

  getMissingPermissions(memberPermissions: Readonly<PermissionsBitField>) {
    const missingPermissions: PermissionResolvable[] = [];
    this.userPermissions.forEach((perm) => {
      if (!memberPermissions.has(perm)) missingPermissions.push(perm);
    });
    return missingPermissions;
  }

  checkClientPermissions(clientPermissions: Readonly<PermissionsBitField>) {
    const missingPermissions: PermissionResolvable[] = [];
    this.botPermissions.forEach((perm) => {
      if (!clientPermissions.has(perm)) missingPermissions.push(perm);
    });
    return !missingPermissions[0] ? true : false;
  }

  getMissingClientPermissions(
    clientPermissions: Readonly<PermissionsBitField>
  ) {
    const missingPermissions: PermissionResolvable[] = [];
    this.botPermissions.forEach((perm) => {
      if (!clientPermissions.has(perm)) missingPermissions.push(perm);
    });
    return missingPermissions;
  }
}

export default PermissionsGuard;
