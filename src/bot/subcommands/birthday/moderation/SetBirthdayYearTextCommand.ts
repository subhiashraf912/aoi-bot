import { ChatInputCommandInteraction } from "discord.js";
import DiscordClient from "../../../classes/client/BaseClient";
import BaseSubCommandExecutor from "../../../classes/bases/BaseSubCommandExecutor";
import { IBirthdaySystem } from "../../../classes/Database/Models/BirthdaySystemSchema";

export default class SetBirthdayYearTextCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "year-text",
      description:
        "Change the year text if the user has a year set, default is', you are now {age} years old!'",
      baseCommand: "set-birthday",
    });
    this.commandBuilder.addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The content of the birthday message.")
        .setRequired(true)
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    try {
      const content = interaction.options.getString("content");

      // Update the birthday message content for the user
      let guildSettings =
        (await client.database.models.birthdaySystem.findOneAndUpdate(
          { serverId: interaction.guildId! },
          { yearMessage: content },
          { new: true }
        )) as IBirthdaySystem;
      if (!guildSettings) {
        //@ts-ignore
        guildSettings = (await client.database.models.birthdaySystem.create(
          { serverId: interaction.guildId! },
          { yearMessage: content },
          { new: true }
        )) as IBirthdaySystem;
      }
      interaction.reply({
        content: `Birthday year text set to: ${content}`,
      });
    } catch (err: any) {
      interaction.reply({
        content: `Error occurred: ${err.message}`,
        ephemeral: true,
      });
    }
  }
}
