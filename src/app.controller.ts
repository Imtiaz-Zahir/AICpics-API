import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return "AIGPICS API";
  }

  @Get('health')
  getHealth(): string {
    return 'OK';
  }
}
