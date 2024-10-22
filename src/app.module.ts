import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';
import { LikesModule } from './likes/likes.module';
import { PhotosModule } from './photos/photos.module';

@Module({
  imports: [ImagesModule, UsersModule, LikesModule, PhotosModule],
  controllers: [AppController],
})
export class AppModule {}
