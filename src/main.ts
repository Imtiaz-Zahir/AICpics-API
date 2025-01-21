import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import 'dotenv/config';

const port = parseInt(process.env.PORT, 10) || 2000;

async function bootstrap() {
  // const httpsOptions = {
  //   http2: true,
  //   https: {
  //     allowHTTP1: true,
  //     key: fs.readFileSync('./server.key'),
  //     cert: fs.readFileSync('./server.crt'),
  //   },
  // };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // new FastifyAdapter(httpsOptions),
  );

  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms'),
  );

  app.listen(port, () => {
    console.log('Server started on http://localhost:' + port);
  });
}

bootstrap();
