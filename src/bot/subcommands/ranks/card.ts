import { ChatInputCommandInteraction } from "discord.js";
import BaseSubCommandExecutor from "../../classes/bases/BaseSubCommandExecutor";
import DiscordClient from "../../classes/client/BaseClient";
import { Rank } from "canvacord";
import { AttachmentBuilder } from "discord.js";

export default class RankCardCommand extends BaseSubCommandExecutor {
  constructor() {
    super({
      name: "card",
      baseCommand: "rank",
      description: "Shows the member's rank card!",
    });
    this.commandBuilder.addUserOption((option) =>
      option.setName("user").setDescription("Enter the user you want.")
    );
  }

  async run(
    client: DiscordClient<boolean>,
    interaction: ChatInputCommandInteraction
  ) {
    await interaction.reply({ content: "Generating your rank card..." });

    const member = await interaction.guild?.members.fetch(
      interaction.options.getUser("user")?.id || interaction.member?.user.id!
    );
    if (!member) {
      interaction.reply({
        content: `I can't find the member provided to get the rank.`,
      });
      return;
    }
    await member.user.fetch(true);
    let memberAvatar: string = member.avatar
      ? member.displayAvatarURL({ extension: "png", size: 4096 })
      : member.user.displayAvatarURL({
          extension: "png",
          size: 4096,
        });
    const memberRanks = await client.database.models.textLevelRanks.find({
      guildId: member.guild.id,
    });
    const guild = await client.guilds.fetch(`${interaction.guildId}`);
    const members = await guild.members.fetch();
    const rankedMembers = memberRanks
      .map((data) => {
        const member = members.get(data.userId);
        return (
          member && {
            member,
            level: data.level,
            xp: data.xp,
            background: data.rankBackground,
          }
        );
      })
      .filter(Boolean) // Filter out members who left the server
      .sort((a, b) => {
        let comparison = 0;
        if (a?.xp! > b?.xp!) comparison = -1;
        if (a?.xp! < b?.xp!) comparison = 1;
        if (a?.level! > b?.level!) comparison = -1;
        if (a?.level! < b?.level!) comparison = +1;
        return comparison;
      });

    const data = await client.configurations.textLevels.ranks.get({
      userId: member.id,
      guildId: member.guild.id,
    });
    const memberRank =
      rankedMembers.findIndex((r) => r?.member.id === member.id) + 1;
    let color, color2, color3;
    switch (member.presence?.status) {
      case "offline":
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
        break;
      case "online":
        color = "#55ff34";
        color2 = "#199900";
        color3 = "#87ff70";
        break;
      case "dnd":
        color = "#ff4642";
        color2 = "#f50500";
        color3 = "#ffb4b3";
        break;
      case "idle":
        color = "#fff528";
        color2 = "#b8af00";
        color3 = "#423f00";
        break;
      case "invisible":
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
        break;
      default:
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
        break;
    }
    const rank = new Rank()
      .setAvatar(memberAvatar)
      .setCurrentXP(data.xp)
      .setRequiredXP(5 * Math.pow(data.level, 2) + 50 * data.level + 100)
      //@ts-ignore
      .setStatus(member.presence?.status || "offline", true)
      .setProgressBar("#FFFFFF", "COLOR")
      .setRank(memberRank, "Rank")
      .setUsername(member.user.username)
      .setDisplayName(member.displayName)
      .setLevel(data.level)
      .setCustomStatusColor(color)
      .setProgressBar(
        [color as string, color2 as string, color3 as string],
        "GRADIENT"
      )
      .setLevelColor(undefined, color)
      .setOverlay("FF0000")
      .renderEmojis(true);
    if (member.user.bannerURL({ extension: "png", size: 4096 })) {
      rank.setBackground(
        "IMAGE",
        member.user.bannerURL({ extension: "png", size: 4096 })!
      );
    }
    if (data.rankBackground) rank.setBackground("IMAGE", data.rankBackground);

    const attachmentBuffer = await rank.build();
    const attachment = new AttachmentBuilder(attachmentBuffer, {
      name: "RankCard.png",
    });
    await interaction.editReply({
      content: "",
      files: [attachment],
    });
  }
}
