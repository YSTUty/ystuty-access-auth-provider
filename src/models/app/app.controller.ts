import { Controller, Get } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';

@Controller('/app')
export class AppController {
  public readonly timeStart = Date.now();

  @Get('ip')
  getIp(@RealIP() ip: string) {
    return { ip };
  }

  @Get('uptime')
  getTime() {
    return { uptime: Date.now() - this.timeStart };
  }
}
