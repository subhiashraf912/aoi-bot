import BaseEvent from "../classes/bases/BaseEvent";
import { GuildMember } from "discord.js";
import DiscordClient from "../classes/client/BaseClient";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("guildMemberAdd");
  }

  async run(client: DiscordClient<boolean>, member: GuildMember) {
    // Check if the newly joined member is a bot
    if (member.user.bot) {
      // Get the ID of the guild where the member joined
      const guildId = member.guild.id;
      // Fetch the join roles configuration for bots from the cache manager
      const configuration = await client.configurations.joinRoles.bot.get(
        guildId
      );
      // If there is no join roles configuration set up for bots in this guild, return
      if (!configuration) return;
      // Assign the configured roles to the new bot member using the member.roles.add() method
      await member.roles.add(configuration.roles.map((r) => r.id));
    } else {
      // Get the ID of the guild where the member joined
      const guildId = member.guild.id;
      // Fetch the join roles configuration for regular members from the cache manager
      const configuration = await client.configurations.joinRoles.member.get(
        guildId
      );
      // If there is no join roles configuration set up for regular members in this guild, return
      if (!configuration) return;
      // Assign the configured roles to the new member using the member.roles.add() method
      await member.roles.add(configuration.roles.map((r) => r.id));
    }
  }
}
