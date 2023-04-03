import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageReaction,
  TextChannel,
  User,
} from "discord.js";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../../classes/client/BaseClient";
import Warn from "../../../utils/@types/Warn";
import { buttonPages, generateWarnsEmbeds } from "../../../utils/Pagination";

export default class ShowWarnsCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "show",
      baseCommand: "warn",
      description: "Shows the warnings of a specific user!",
    });
    this.commandBuilder.addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Enter the user you want to see the warns of here")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const user = interaction.options.getUser("user", true);

      const result = await client.configurations.warns.getAllWarns({
        guildId: interaction.guildId!,
        userId: user.id,
      });
      const embeds = generateWarnsEmbeds({
        data: result,
        fieldName: "",
        fieldValue: "",
        pageSize: 5,
        title: `-> ${user.tag} Warns`,
      });
      buttonPages(interaction, embeds);
    } catch (err: any) {
      interaction.reply({
        content: `Error occured: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
