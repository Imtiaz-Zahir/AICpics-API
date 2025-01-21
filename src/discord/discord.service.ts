import { Injectable } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

@Injectable()
export class DiscordService {
  constructor() {
    prisma.bots.findMany().then((bots) =>
      bots.forEach(async (bot) => {
        const client = await this.getClient(bot.token);
        const channel = await this.getChannel({
          channelId: '1281679888826372149',
          client,
        });
        this.setChannel({ channelId: '1281679888826372149', channel });
      }),
    );
  }

  private channels: {
    [key: string]: TextChannel[];
  } = {};

  private index = 0;

  private async getClient(botToken: string) {
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

    await client.login(botToken);

    return client;
  }

  private async getChannel({
    channelId,
    client,
  }: {
    channelId: string;
    client: Client;
  }) {
    const channel = await client.channels.fetch(channelId);
    if (!channel) throw new Error('Channel not found.');

    if (channel.isTextBased().valueOf() === false)
      throw new Error('Channel is not text channel.');

    return channel as TextChannel;
  }

  private setChannel({
    channelId,
    channel,
  }: {
    channelId: string;
    channel: TextChannel;
  }) {
    if (!this.channels[channelId]) this.channels[channelId] = [];
    this.channels[channelId].push(channel);
  }

  async getAttachment({
    messageId,
    channelId,
  }: {
    messageId: string;
    channelId: string;
  }) {
    if (this.index >= this.channels[channelId].length) this.index = 0;

    const channel = this.channels[channelId][this.index++];
    const message = await channel.messages.fetch(messageId);

    return message.attachments.first();
  }
}
