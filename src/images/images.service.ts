import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const dbSSLCert = process.env.DATABASE_SSL_CERT;

if (!connectionString) {
  throw new Error('DATABASE_URL must be set');
}

if (!dbSSLCert) {
  throw new Error('DATABASE_SSL_CERT must be set');
}

@Injectable()
export class ImagesService {
  private poll: Pool;
  constructor() {
    this.poll = new Pool({
      connectionString,
    });
  }

  async getImages({
    prompt,
    skip,
    take,
  }: {
    take?: number;
    skip?: number;
    prompt?: string;
  }): Promise<{ id: string; prompt: string }[]> {
    const result = await this.poll.query(
      'SELECT id,prompt FROM "Images" ORDER BY "generatedAt" DESC LIMIT $1 OFFSET $2',
      [take, skip],
    );

    return result.rows;


    // return this.prisma.images.findMany({
    //   take,
    //   skip,
    //   where: {
    //     prompt: {
    //       contains: prompt,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     prompt: true,
    //   },
    //   // orderBy: [
    //   //   {
    //   //     generatedAt: 'desc',
    //   //   },
    //   //   {
    //   //     download: 'desc',
    //   //   },
    //   // ],
    // });
  }

  async getImage(id: string) {
    const result = await this.poll.query(
      'SELECT * FROM "Images" WHERE id = $1',
      [id],
    );

    return result.rows[0];
    // return this.prisma.images.findUnique({
    //   where: {
    //     id,
    //   },
    // });
  }

  async countImages(prompt?: string) {
    const result = await this.poll.query(
      'SELECT COUNT(*) FROM "Images" WHERE prompt LIKE $1',
      [prompt],
    );

    return result.rows[0].count;
    // return this.prisma.images.count({
    //   where: {
    //     prompt: {
    //       contains: prompt,
    //     },
    //   },
    // });
  }
}
