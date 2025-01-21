import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DiscordService } from 'src/discord/discord.service';
import { ImagesService } from 'src/images/images.service';
import { Readable } from 'stream';

@Controller('photos')
export class PhotosController {
  constructor(
    private DiscordService: DiscordService,
    private ImagesService: ImagesService,
  ) {}

  @Get(':slug')
  async getPhoto(
    @Res() response: Response,
    @Param('slug') slug: string,
    @Query('width', new DefaultValuePipe(800), ParseIntPipe) width: number,
  ) {
    try {
      const slugSlices = slug.split('_');
      const id = slugSlices[slugSlices.length - 1].slice(0, -5);

      const image = await this.ImagesService.getImage(id);

      if (!image) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      const sanitizedPrompt = image.prompt
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .slice(0, 7)
        .join('-')
        .toLowerCase();

      if (sanitizedPrompt !== slugSlices.slice(0, -1).join('_')) {
        throw new HttpException('Invalid Url', HttpStatus.NOT_FOUND);
      }

      if (width < 400) width = 400;
      if (width > 800) width = 800;

      const messageId = BigInt('0x' + id).toString();
      const attachment = await this.DiscordService.getAttachment({
        messageId,
        channelId: '1281679888826372149',
      });

      if (!attachment) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      const height = Math.round((attachment.height * width) / attachment.width);

      const imageResponse = await fetch(
        `${attachment.url}&format=webp&quality=lossless&width=${width}&height=${height}`,
      );

      if (!imageResponse.ok) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      const nodeStream = Readable.fromWeb(imageResponse.body);

      response.setHeader('Content-Type', attachment.contentType);
      response.setHeader(
        'Content-Length',
        imageResponse.headers.get('Content-Length'),
      );
      response.setHeader(
        'Cache-Control',
        'public, max-age=31536000, immutable',
      );
      response.setHeader('Vary', 'Accept, Width');

      nodeStream.pipe(response);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }
}
