import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private ImagesService: ImagesService) {}

  @Get()
  async getImages(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('prompt', new DefaultValuePipe(undefined))
    prompt?: string,
  ) {
    try {
      if (take < 1) take = 1;
      if (take > 100) take = 100;

      const totalImages = await this.ImagesService.countImages(prompt);

      const images = await this.ImagesService.getImages({ take, skip, prompt });

      return {
        totalImages,
        images,
      };
    } catch (error) {
      console.error(error);
    }
  }

  @Get(':id')
  async getImage(@Param('id') id: string) {
    try {
      const image = await this.ImagesService.getImage(id);

      if (!image) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }
      return image;
    } catch (error) {
      console.error(error);
    }
  }
}
