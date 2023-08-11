import {
  CacheType,
  CommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";
export default class HelpSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "help",
      description: "Shows all commands and their descriptions",
    });
  }
  async run(
    client: DiscordClient<true>,
    interaction: CommandInteraction<CacheType>
  ) {
    const embed = new EmbedBuilder()
      .setTitle("Welcome!")
      .setDescription(
        "Thank you for using me. You can navigate through the commands using the buttons and menus below."
      )
      .setColor(Colors.Blue)
      .setThumbnail(
        "https://i.pinimg.com/originals/23/d7/16/23d71629f0ae9f5e26a710e66e792889.gif"
      )
      .setTimestamp()
      .setImage(
        "https://cdn.discordapp.com/attachments/1128236224193249360/1128236243604471828/beso_1.gif"
      )
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setFooter({ text: "0" }); // We start at page 0

    const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help-menu")
        .setPlaceholder("Select a category...")
        .addOptions([
          {
            label: "Slash Commands",
            description: "List all slash commands",
            value: "slash",
          },
          {
            label: "Sub Slash Commands",
            description: "List all sub slash commands",
            value: "subslash",
          },
        ])
    );

    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("help-back")
        .setLabel("Back")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🔙")
        .setDisabled(true), // initially disabled
      new ButtonBuilder()
        .setLabel("Vote For Me!")
        .setStyle(ButtonStyle.Link)
        .setEmoji("🗳️")
        .setURL(`https://top.gg/bot/${client.user.id}/vote`),
      new ButtonBuilder()
        .setLabel("Join Support Server")
        .setStyle(ButtonStyle.Link)
        .setEmoji("👥")
        .setURL("https://discord.gg/TmtwMyCtwh")
    );

    const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Read the Docs")
        .setStyle(ButtonStyle.Link)
        .setEmoji("📖")
        .setURL("https://google.com"),
      new ButtonBuilder()
        .setLabel("Go to dashboard")
        .setStyle(ButtonStyle.Link)
        .setEmoji("📈")
        .setURL("https://google.com"),
      new ButtonBuilder()
        .setCustomId("help-forward")
        .setLabel("Forward")
        .setEmoji("🔜")
        .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row1, row2, row3],
    });
  }
}
