import { Injectable } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import 'dotenv/config';

const botToken = process.env.DISCORD_BOT_TOKEN;
if (!botToken) throw new Error('Discord bot token is required');

@Injectable()
export class DiscordService {
  private channel: TextChannel;

  constructor() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}`);
    });

    client.login(botToken).then(() => {
      client.channels
        .fetch('1281679888826372149')
        .then((channel) => {
          if (!channel) throw new Error('Channel not found.');
          if (channel.isTextBased().valueOf() === false)
            throw new Error('Channel is not text channel.');
          this.channel = channel as TextChannel;
        })
        .catch((error) => {
          console.error('Error fetching channel:', error);
        });
    });
  }

  getMessages() {
    return this.channel.messages.fetch({ limit: 100 });
  }

  getMessage(id: string) {
    return this.channel.messages.fetch(id);
  }

  async getAttachment(messageId: string) {
    const message = await this.channel.messages.fetch(messageId);
    return message.attachments.first();
  }
}
