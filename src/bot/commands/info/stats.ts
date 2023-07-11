import { CacheType, CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/client/BaseClient";
import { BaseSlashCommand } from "../../classes/bases/BaseSlashCommand";
export default class StatsSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "stats",
      description: "Sends the stats of the bot",
    });
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

    const promises = [
      client.shard?.fetchClientValues("guilds.cache.size")!,
      client.shard?.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      )!,
    ];

    Promise.all(promises)
      .then((results) => {
        const totalGuilds = results[0].reduce(
          (acc: any, guildCount: any) => acc + guildCount,
          0
        );
        const totalMembers = results[1].reduce(
          (acc: any, memberCount: any) => acc + memberCount,
          0
        );
        return interaction.reply(
          `Server count: ${totalGuilds}\nMember count: ${totalMembers}`
        );
      })
      .catch(console.error);
  }
}
