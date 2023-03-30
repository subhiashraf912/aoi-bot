import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";

export default class ChannelCreateCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "remove-text",
      baseCommand: "levels",
      group: "roles",
      description: "Adds a text level role to the database.",
    });
    this.commandBuilder
      .addIntegerOption((option) =>
        option
          .setName("level")
          .setDescription("The level that the member needs to get the role.")
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100)
      )
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription(
            "The role that the member will get once achieved the level you specified."
          )
          .setRequired(true)
      );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const role = await interaction.guild?.roles.fetch(
        interaction.options.getRole("role", true).id
      );
      const level = interaction.options.getInteger("level", true);

      if (!role) {
        interaction.reply("I could not find that role, try again please.");
        return;
      }
      if (!role.editable) {
        interaction.reply(
          "I can't edit this role, check my permissions and try again."
        );
        return;
      }
      const { roles } = await client.configurations.textLevels.roles.get(
        interaction.guildId!
      );
      if (!roles[level]) {
        interaction.reply("This level doesn't exist in the text roles.");
        return;
      }
      delete roles[level];
      await client.configurations.textLevels.roles.update({
        roles,
        guildId: interaction.guildId!,
      });
      await interaction.reply({
        content:
          "Level `{level}` has been deleted from the level roles!".replace(
            "{level}",
            level.toString()
          ),
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
