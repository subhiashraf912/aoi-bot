import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import CommandCategory from "./CommandCategories";

interface TextCommandOptions {
  name: string;
  aliases?: string[];
  category: CommandCategory;
  permissions: PermissionsGuard;
  description?: string;
  usage?: string;
}

export default TextCommandOptions;
