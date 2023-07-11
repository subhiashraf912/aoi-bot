import {
  CacheType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";

export default class PurgeSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "purge",
      description: "Deletes specific amount of messages in a channel!",
    });
    this.slashCommandBuilder
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount of messages to delete")
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .setDMPermission(false);
  }
  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    const amount = interaction.options.getInteger("amount") || 100; // Assumes 'amount' is the number of messages to delete
    const channel = interaction.channel!;
    if (channel.isDMBased()) return;

    await channel.bulkDelete(amount, true);
    interaction.reply({
      content: `${amount} messages have been deleted!`,
    });
  }
}
