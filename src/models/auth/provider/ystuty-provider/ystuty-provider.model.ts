import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as xEnv from '@my-environment';

import { YstutyService } from './ystuty.service';
import { YstutyProvider } from './ystuty.provider';

@Module({
  imports: [],
})
export class YstutyProviderModule {
  private static readonly logger = new Logger(YstutyProviderModule.name);

  static register() {
    this.logger.log('Registered');

    return {
      module: YstutyProviderModule,
      imports: [
        ClientsModule.register([
          {
            name: 'MS_S_GENERAL_SERVER',
            transport: Transport.TCP,
            options: {
              port: xEnv.MS_S_GENERAL_SERVER_PORT,
              host: xEnv.MS_S_GENERAL_SERVER_HOST,
            },
          },
        ]),
      ],
      providers: [YstutyService, YstutyProvider],
      exports: [YstutyService],
    };
  }
}
