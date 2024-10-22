import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as morgan from 'morgan';

async function bootstrap() {
  const httpsOptions = {
    http2: true,
    https: {
      allowHTTP1: true,
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./server.crt'),
    },
  };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule
    // new FastifyAdapter(httpsOptions),
  );

  app.use(morgan('combined'));

  app.listen(2000, ()=>{
    console.log('Server started on http://localhost:2000');
  });
}

bootstrap();
