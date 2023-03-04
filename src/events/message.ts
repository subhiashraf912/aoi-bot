import BaseEvent from "../classes/bases/BaseEvent";
import { EmbedBuilder, Message } from "discord.js";
import DiscordClient from "../classes/client/BaseClient";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async run(client: DiscordClient<boolean>, message: Message) {
    if (!message.inGuild()) {
      if (message.author.id === client.user?.id) return;
      const postedMessageContent = `A message was sent in my DMs by ${message.author.toString()}:`;
      try {
        const aoi = await client.users.fetch("805422315538087936");
        const embed = new EmbedBuilder()
          .addFields([
            { name: "Sender ID:", value: message.author.id, inline: true },
            { name: "Sender tag:", value: message.author.tag },
          ])
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ extension: "gif" }),
          })
          .setTimestamp()
          .setDescription(postedMessageContent);
        await aoi.send({ content: postedMessageContent, embeds: [embed] });
        console.log(postedMessageContent);
      } catch (err) {
        console.log(err);
      }
    }
    if (message.author.bot || !message.member || !message.guild) return;
    if (message.content.includes(client.user?.toString()!)) {
      // const authedUsers = ["805422315538087936", "507684120739184640"];
      // if (!authedUsers.includes(message.author.id))
      //   return message.reply("I respond only to my master, Aoi.");
      const bannedWords = ["gay", "kill", "ass", "pussy", "balls"];
      let shouldReturn = false;
      message.content.split(" ").forEach((word) => {
        if (bannedWords.includes(word.toLowerCase())) shouldReturn = true;
      });

      if (shouldReturn) {
        const aze = await client.users.fetch("507684120739184640");
        await aze.send(
          `The user: ${message.author.toString()} has used inappropriate message in the ai chat, message content is:\`\`\`${
            message.content
          }\`\`\``
        );
        return message.reply(
          "I am not allowed to provide any information about the data you have provided me, Keep in mind that sending such inappropriate messages will result you in being banned from using the bot."
        );
      }
      if (message.content) console.log(message.content);
      const GPTResponse = await client.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `${message.content.replace(client.user?.toString()!, "")}`,
          },
        ],
        max_tokens: 1000,
        stop: ["ChatGPT:", "Yelan:"],
        temperature: 0.5,
        // stream: true,
      });
      const gptContent = GPTResponse.data.choices[0].message?.content!;
      if (gptContent.length < 2000) {
        const contents = [gptContent.slice(0, 2000), gptContent.slice(2000)];
        for (const content of contents) {
          await message.channel.send({ content });
        }
      } else {
        message.reply({
          content: GPTResponse.data.choices[0].message?.content!,
        });
      }
    }
    const prefix = await client.configurations.prefixes.get(message.guild.id);
    if (message.content.startsWith(prefix)) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);
      const command =
        client.commands.get(cmdName.toLowerCase()) ||
        client.commands.get(client.aliases.get(cmdName.toLowerCase())!);

      if (command) {
        const runCommand = () => {
          command.run(client, message, cmdArgs);
        };
        const memberPermissions = message.member.permissions;
        const clientPermissions = message.guild.members.me?.permissions!;
        if (command.permissions) {
          if (command.permissions.checkMemberPermissions(memberPermissions)) {
            if (command.permissions.checkClientPermissions(clientPermissions)) {
              runCommand();
            } else {
              const missingPermissions = command.permissions
                .getMissingClientPermissions(clientPermissions)
                .join(" ");
              return message.reply(
                `I need \`${missingPermissions}\` permissions to run this command.`
              );
            }
          } else {
            const missingPermissions = command.permissions
              .getMissingPermissions(memberPermissions)
              .join(" ");
            return message.reply(
              `You need \`${missingPermissions}\` permissions to run this command.`
            );
          }
        } else {
          runCommand();
        }
      }
    } else {
      return;
      client.configurations.textLevels.handler.HandleTextMessage(message);
    }
  }
}
