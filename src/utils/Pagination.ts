import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import Warn from "./@types/Warn";

async function buttonPages(
  interaction: ChatInputCommandInteraction,
  pages: EmbedBuilder[],
  time = 60000
) {
  if (time < 30000) throw new Error("Time must be greater than 30 seconds");
  await interaction.deferReply();
  if (pages.length === 1) {
    const page = await interaction.editReply({
      embeds: pages,
      components: [],
    });
    return page;
  }

  const prev = new ButtonBuilder()
    .setCustomId("prev")
    .setEmoji("🔙")
    .setLabel("Previous")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);
  const home = new ButtonBuilder()
    .setCustomId("home")
    .setLabel("Home")
    .setEmoji("🏠")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(true);
  const next = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next")
    .setEmoji("⏩")
    .setStyle(ButtonStyle.Primary);

  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    prev,
    home,
    next
  );

  let index = 0;
  const currentPage = await interaction.editReply({
    embeds: [pages[index]],
    components: [buttonRow],
  });
  //creating the collector
  const collector = await currentPage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      i.reply({ content: "You cannot use these buttons" });
      return;
    }
    await i.deferUpdate();
    if (i.customId === "home") {
      index = 0;
    } else if (i.customId === "prev") {
      if (index > 0) index--;
    } else if (i.customId === "next") {
      if (index < pages.length - 1) index++;
    }

    if (index === 0) prev.setDisabled(true);
    else {
      prev.setDisabled(false);
      home.setDisabled(false);
    }

    if (index === pages.length - 1) next.setDisabled(true);
    else next.setDisabled(false);
    await currentPage.edit({
      embeds: [pages[index]],
      components: [buttonRow],
    });
    collector.resetTimer();
  });

  //ending the collector
  collector.on("end", async (i) => {
    await currentPage.edit({
      embeds: [pages[index]],
      components: [],
    });
  });
}

type generateEmbedsOptions<K> = {
  data: K[];
  pageSize: number;
  fieldName: string;
  fieldValue: string;
  title: string;
};
function generateWarnsEmbeds(
  options: generateEmbedsOptions<Warn>
): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = [];
  const pageCount = Math.ceil(options.data.length / options.pageSize);
  for (let i = 0; i < pageCount; i++) {
    const embed = new EmbedBuilder()
      .setDescription(
        `\`\`\`css\n${options.title} (${i + 1}/${pageCount})\`\`\``
      )
      .setColor("Blue");
    const start = i * options.pageSize;
    const end = start + options.pageSize;
    for (let j = start; j < end && j < options.data.length; j++) {
      const element = options.data[j];
      embed.addFields({
        name: `\`${j + 1}- ID: ${element.id}\``,
        value: `User: <@${element.userId}>\nReason: ${element.reason}\nModerator: <@${element.moderatorId}>`,
      });
    }
    embed.setFooter({ text: `Page ${i + 1}/${pageCount}` });
    embeds.push(embed);
  }
  return embeds;
}
export { generateWarnsEmbeds, buttonPages };
