import { CacheType, CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";
import { pushCommands } from "../../utils/registry";
export default class StatsSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "push-commands",
      description: "Pushes the commands to discord API",
    });
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: CommandInteraction<CacheType>
  ) {
    if (!client.checkDevelopers(interaction.user.id)) {
      interaction.reply({
        content: "Only bot developers have access to this command.",
      });
      return;
    }

    await interaction.reply({ content: "Pushing commands..." });

    await pushCommands(client);
    interaction.editReply({
      content: "Commands were pushed successfully",
    });
  }
}
