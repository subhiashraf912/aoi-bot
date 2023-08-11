import BaseEvent from "../classes/bases/BaseEvent";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Interaction,
} from "discord.js";
import DiscordClient from "../classes/client/BaseClient";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client: DiscordClient<boolean>, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      console.log("Command interaction");
      const { commandName } = interaction;
      const cmd = client.slashCommands.get(commandName);
      const subcommandGroup = interaction.options.getSubcommandGroup(false);
      const subcommandName = interaction.options.getSubcommand(false);
      if (subcommandName) {
        const command = client.subcommands.find(
          (subcommand) =>
            subcommand.group === subcommandGroup &&
            subcommandName === subcommand.name &&
            subcommand.baseCommand === commandName
        );
        if (!command) {
          await interaction.reply({
            content:
              "this command does not have a run method or under maintinance.",
            ephemeral: true,
          });
          return;
        }
        await command?.run(client, interaction);
        return;
      }

      if (cmd) {
        cmd.run(client, interaction);
      } else {
        interaction.reply({ content: "This command has no run method." });
      }
    }

    if (interaction.isButton()) {
      if (!["help-back", "help-forward"].includes(interaction.customId)) return;

      const isBack = interaction.customId === "help-back";
      let pageIndex = parseInt(interaction.message.embeds[0].footer?.text!); // Assume you store the page index in the footer

      const combinedCommands = [
        ...client.slashCommands.map((command) => command.getSlashCommandJSON()),
        ...client.subcommandsBuilders.map((command) => command.toJSON()),
      ];

      const totalPages = Math.ceil(combinedCommands.length / 5);

      if (isBack) pageIndex--;
      else pageIndex++;

      // Ensure the page index is in the correct range
      if (pageIndex < 0) pageIndex = 0;
      if (pageIndex >= totalPages) pageIndex = totalPages - 1;

      const embed = new EmbedBuilder()
        .setTitle(`Page ${pageIndex + 1} of ${totalPages}`)
        .setFooter({ text: pageIndex.toString() });

      for (
        let i = pageIndex * 5;
        i < (pageIndex + 1) * 5 && i < combinedCommands.length;
        i++
      ) {
        const command = combinedCommands[i];
        embed.addFields([{ name: command.name, value: command.description }]);
      }

      const backDisabled = pageIndex == 0;
      const forwardDisabled = pageIndex == totalPages - 1;
      const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("help-back")
          .setLabel("Back")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🔙")
          .setDisabled(backDisabled),
        new ButtonBuilder()
          .setCustomId("help-forward")
          .setLabel("Forward")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🔜")
          .setDisabled(forwardDisabled)
      );

      await interaction.update({
        embeds: [embed],
        components: [
          interaction.message.components[0],
          interaction.message.components[1],
          row2,
        ],
      });
    }
  }
}
