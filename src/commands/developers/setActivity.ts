import { ActivityType, CacheType, CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";
export default class StatsSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "activity",
      description: "Sends a private message to someone's DMs",
    });

    this.slashCommandBuilder.addStringOption((option) =>
      option
        .setName("status")
        .setRequired(true)
        .setDescription("The status of the bot you want to be visible")
    );
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
    const status = interaction.options.get("status", true).value! as string;
    try {
      client.user?.setActivity({ name: status, type: ActivityType.Playing });
      interaction.reply({
        content: "Status was set successfully",
        ephemeral: true,
      });
    } catch (err: any) {
      {
        interaction.reply({
          content: `Error: ${err.message}`,
          ephemeral: true,
        });
      }
    }
  }
}
