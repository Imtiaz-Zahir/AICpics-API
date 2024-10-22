import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller';
import { DiscordService } from 'src/discord/discord.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  providers: [DiscordService, ImagesService],
  controllers: [PhotosController],
})
export class PhotosModule {}
