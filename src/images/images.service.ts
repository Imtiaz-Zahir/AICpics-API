import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import 'dotenv/config';

const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;
const database = process.env.DATABASE_NAME;

const dbSSLCert = process.env.DATABASE_SSL_CERT;

if (!user) {
  throw new Error('DATABASE_USER must be set');
}
if (!password) {
  throw new Error('DATABASE_PASSWORD must be set');
}
if (!host) {
  throw new Error('DATABASE_HOST must be set');
}
if (!port) {
  throw new Error('DATABASE_PORT must be set');
}
if (!database) {
  throw new Error('DATABASE_NAME must be set');
}

if (!dbSSLCert) {
  throw new Error('DATABASE_SSL_CERT must be set');
}

@Injectable()
export class ImagesService {
  private poll: Pool;
  constructor() {
    this.poll = new Pool({
      user,
      password,
      host,
      port: parseInt(port, 10),
      database,
      ssl: {
        rejectUnauthorized: true,
        ca: dbSSLCert,
      },
    });
  }

  async getImages({
    prompt,
    skip,
    take,
  }: {
    take: number;
    skip: number;
    prompt?: string;
  }): Promise<{ id: string; prompt: string }[]> {
    const result = await this.poll.query(
      `SELECT id,prompt FROM "Images" ${prompt ? `WHERE prompt LIKE '%${prompt}%' ` : ''} ORDER BY "generatedAt" DESC LIMIT $1 OFFSET $2`,
      [take, skip],
    );

    return result.rows;
  }

  async getImage(id: string) {
    const result = await this.poll.query(
      'SELECT * FROM "Images" WHERE id = $1',
      [id],
    );

    return result.rows[0];
  }

  async countImages(prompt?: string) {
    const result = await this.poll.query(
      `SELECT COUNT(*) FROM "Images" ${prompt ? `WHERE prompt LIKE '%${prompt}%' ` : ''}`,
    );

    return result.rows[0].count;
  }
}
