import {
  ChatInputCommandInteraction,
  ColorResolvable,
  GuildMember,
} from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class RoleCreateCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "create",
      baseCommand: "role",
      description: "Creates a role with specific settings in the server",
    });
    this.commandBuilder
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the role you want to create!")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("color")
          .setDescription("Enter the color of the role you want to create!")
          .addChoices(
            { name: "White", value: "0xffffff" },
            { name: "Aqua", value: "0x1abc9c" },
            { name: "Green", value: "0x57f287" },
            { name: "Blue", value: "0x3498db" },
            { name: "Yellow", value: "0xfee75c" },
            { name: "Purple", value: "0x9b59b6" },
            { name: "Fuchsia", value: "0xeb459e" },
            { name: "Gold", value: "0xf1c40f" },
            { name: "Orange", value: "0xe67e22" },
            { name: "Red", value: "0xed4245" },
            { name: "Grey", value: "0x95a5a6" },
            { name: "Navy", value: "0x34495e" },
            { name: "DarkAqua", value: "0x11806a" },
            { name: "DarkGreen", value: "0x1f8b4c" },
            { name: "DarkBlue", value: "0x206694" },
            { name: "DarkPurple", value: "0x71368a" },
            { name: "DarkVividPink", value: "0xad1457" },
            { name: "DarkGold", value: "0xc27c0e" },
            { name: "DarkOrange", value: "0xa84300" },
            { name: "DarkRed", value: "0x992d22" },
            { name: "DarkGrey", value: "0x979c9f" },
            { name: "DarkerGrey", value: "0x7f8c8d" },
            { name: "LightGrey", value: "0xbcc0c0" },
            { name: "Blurple", value: "0x5865f2" },
            { name: "Greyple", value: "0x99aab5" }
          )
      )
      .addBooleanOption((option) =>
        option
          .setName("hosited")
          .setDescription(
            "If you want the role to be hosited, select true, if not then select false."
          )
      )
      .addBooleanOption((option) =>
        option
          .setName("mentionable")
          .setDescription(
            "If you want the role to be mentionable, select true, if not then select false."
          )
      )
      .addIntegerOption((option) =>
        option
          .setName("position")
          .setDescription("Enter the position of the role.")
      );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    const name = interaction.options.getString("name", true);
    const color =
      (interaction.options.getString("color", false) as ColorResolvable) ||
      undefined;
    const hoist = interaction.options.getBoolean("hosited", false) || undefined;
    const mentionable =
      interaction.options.getBoolean("mentionable", false) || undefined;
    const position =
      interaction.options.getInteger("position", false) || undefined;
    const reason = `Responsible user: ${
      (interaction.member as GuildMember).user.tag
    }`;

    try {
      const role = await interaction.guild?.roles.create({
        name,
        color,
        hoist,
        mentionable,
        position,
        reason,
      });
      await interaction.reply({
        content: `The role ${role?.toString()} has been created with the following settings\n> Name: ${name}\n> Color: ${
          color || "Not Specified"
        }\n> Hosited Role?: ${hoist ? "Yes" : "No"}\n> Mentionable?: ${
          mentionable ? "Yes" : "No"
        }\n> Position: ${position ? position.toString() : "Not Speicifed"}`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
