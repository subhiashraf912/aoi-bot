import { AttachmentBuilder, ChatInputCommandInteraction, Snowflake } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";
import TextLevelsRanksConfiguration from "../../utils/@types/TextLevelsRanksConfiguration";
import { createCanvas, loadImage } from "canvas";

export default class LeaderboardCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "leaderboard",
            description: "Gets the leaderboard of the server!",
        });
        this.slashCommandBuilder.addIntegerOption(option => option.setName("page").setDescription("The page you want to seek to in the leaderboard"))
    }
    async run(
        client: DiscordClient<boolean>,
        interaction: ChatInputCommandInteraction
    ) {
        await interaction.reply({ content: "Generating server rank leaderboard..." })
        try {
            const page = interaction.options.getInteger("page") || 1
            const ranks = await client.configurations.textLevels.ranks.getRanksForGuild(interaction.guildId!)
            if (ranks.length < 1) {
                await interaction.editReply({ content: "This guild does not have any ranks!" })
                return
            }
            // const image = await createLeaderboard(client, interaction.guildId!, ranks)
            const image = await createLeaderboard(client, interaction.guildId!, ranks, 5, page)
            const attachment = new AttachmentBuilder(image, {
                name: "Leaderboard.png",
            });
            await interaction.editReply({
                content: "",
                files: [attachment],
            });
        } catch (err: any) {
            interaction.editReply({ content: err.message, });
        }
    }
}
export async function createLeaderboard(
    client: DiscordClient<boolean>,
    guildId: Snowflake,
    rankData: TextLevelsRanksConfiguration[],
    membersPerPage: number,
    pageNumber: number
): Promise<Buffer> {
    const padding = 100;
    const margin = 100;
    const canvasWidth = 800;
    const canvasHeight = (membersPerPage * 100) + padding;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px sans-serif";
    ctx.fillText(`Top ${membersPerPage} Members - Page ${pageNumber}`, 50, 50);

    // Fetch members and sort by rank
    const guild = client.guilds.cache.get(guildId)!;
    const members = await guild.members.fetch();

    const rankedMembers = rankData
        .map((data) => {
            const member = members.get(data.userId);
            return member && {
                member,
                level: data.level,
                xp: data.xp,
            };
        })
        .filter(Boolean) // Filter out members who left the server
        .sort((a, b) => b?.xp! - a?.xp!) // Sort by XP

    // Calculate which members to display
    const startIndex = (pageNumber - 1) * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    const membersToDisplay = rankedMembers.slice(startIndex, endIndex);

    // Draw member data
    const startX = 50;
    let startY = 100;
    const numMembersToDisplay = membersToDisplay.length;
    if (numMembersToDisplay === 0) {
        // Display message if no members found for current page
        ctx.fillStyle = "#ffffff";
        ctx.font = "24px sans-serif";
        ctx.fillText("No members found for this page.", startX, startY);
    }
    for (let i = 0; i < numMembersToDisplay; i++) {
        const { member, level, xp } = membersToDisplay[i]!;
        // Rectangle
        const cornerRadius = 20;
        const rectWidth = 550;
        const rectHeight = padding - 10;
        const rectX = 0;
        // const rectX = startX;
        const rectY = startY - 10;
        ctx.beginPath();
        ctx.moveTo(rectX + cornerRadius, rectY);
        ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
        ctx.arc(
            rectX + rectWidth - cornerRadius,
            rectY + cornerRadius,
            cornerRadius,
            Math.PI * 1.5,
            Math.PI * 2);
        ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
        ctx.arc(
            rectX + rectWidth - cornerRadius,
            rectY + rectHeight - cornerRadius,
            cornerRadius,
            0,
            Math.PI * 0.5
        );
        ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
        ctx.arc(
            rectX + cornerRadius,
            rectY + rectHeight - cornerRadius,
            cornerRadius,
            Math.PI * 0.5,
            Math.PI
        );
        ctx.lineTo(rectX, rectY + cornerRadius);
        ctx.arc(
            rectX + cornerRadius,
            rectY + cornerRadius,
            cornerRadius,
            Math.PI,
            Math.PI * 1.5
        );
        ctx.closePath();

        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fill();

        // Avatar
        const avatar = await loadImage(
            member.user.displayAvatarURL({ extension: "png", size: 4096 })
        );
        ctx.save();
        ctx.beginPath();
        ctx.arc(startX + 32, startY + 32, 32, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, startX, startY, 64, 64);
        ctx.restore();



        // Rank
        ctx.fillStyle = "#ffffff";
        ctx.font = "24px sans-serif";
        ctx.fillText(`${(i + (membersPerPage * (pageNumber - 1))) + 1}.`, startX + 80, startY + 28);

        // Username
        ctx.font = "28px sans-serif";
        ctx.fillText(member.user.username, startX + 80, startY + 60);

        // XP and level
        ctx.font = "24px sans-serif";
        ctx.fillText(`Level ${level}`, startX + 300, startY + 28);
        ctx.fillText(`XP ${xp}`, startX + 300, startY + 60);

        startY += margin;

    }

    return canvas.toBuffer();
}