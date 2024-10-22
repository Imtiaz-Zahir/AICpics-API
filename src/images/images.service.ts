import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ImagesService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getImages({
    prompt,
    skip,
    take,
  }: {
    take?: number;
    skip?: number;
    prompt?: string;
  }) {
    return this.prisma.images.findMany({
      take,
      skip,
      where: {
        prompt: {
          contains: prompt,
        },
      },
      select: {
        id: true,
        prompt: true,
      },
      // orderBy: [
      //   {
      //     generatedAt: 'desc',
      //   },
      //   {
      //     download: 'desc',
      //   },
      // ],
    });
  }

  async getImage(id: string) {
    return this.prisma.images.findUnique({
      where: {
        id,
      },
    });
  }

  async countImages(prompt?: string) {
    return this.prisma.images.count({
      where: {
        prompt: {
          contains: prompt,
        },
      },
    });
  }
}
