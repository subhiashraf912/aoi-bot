import { GuildMember, TextChannel } from "discord.js";
import createWelcomeScreen, {
  WelcomeScreenOptions,
} from "../canvas/welcomeCardV1";
import DiscordClient from "../classes/client/BaseClient";

export default async function sendWelcomeAttachment(
  client: DiscordClient<true>,
  member: GuildMember
) {
  let welcomeSystem = await client.database.models.welcomeSystem.findOne({
    guildId: member.guild.id,
  });

  if (!welcomeSystem) {
    // create default welcome system
    welcomeSystem = await client.database.models.welcomeSystem.create({
      guildId: member.guild.id,
      channelId: null,
    })!;
  }

  let options: WelcomeScreenOptions | null =
    await client.database.models.welcomeScreens.findOne({
      guildId: member.guild.id,
    });
  if (!options) {
    // create default welcome screen options
    options = await client.database.models.welcomeScreens.create({
      guildId: member.guild.id,
    })!;
  }

  if (!welcomeSystem || !welcomeSystem.enabled) return;

  const channel = member.guild.channels.cache.get(
    welcomeSystem.channelId!
  ) as TextChannel;

  if (!channel) {
    console.log(
      `Could not find welcome channel ${welcomeSystem.channelId} in ${member.guild.name}.`
    );
    return;
  }

  const welcomeMessage = welcomeSystem.content
    .replace("{guildName}", member.guild.name)
    .replace("{member-mention}", member.toString());

  try {
    if (welcomeSystem.sendAttachment) {
      // send message with attachment
      const attachment = await createWelcomeScreen(member, options);
      await channel.send({
        content: welcomeMessage,
        files: [
          /* attachment file buffer or attachment file URL */
          attachment,
        ],
      });
    } else {
      // send message without attachment
      await channel.send(welcomeMessage);
    }
  } catch (error) {
    console.log(
      `Error sending welcome message to ${channel.name} in ${member.guild.name}: ${error}`
    );
  }
}
