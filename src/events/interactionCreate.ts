import BaseEvent from "../classes/bases/BaseEvent";
import { Interaction } from "discord.js";
import DiscordClient from "../classes/client/BaseClient";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client: DiscordClient<boolean>, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;
      const cmd = client.slashCommands.get(commandName);
      const subcommandGroup = interaction.options.getSubcommandGroup(false);
      const subcommandName = interaction.options.getSubcommand(false);
      if (subcommandName) {
        console.log(client.subcommands);

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
  }
}
