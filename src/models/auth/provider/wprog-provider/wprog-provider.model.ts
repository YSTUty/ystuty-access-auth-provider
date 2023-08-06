import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { WprogService } from './wprog.service';
import { WprogProvider } from './wprog.provider';

// const [proxyType, httpsAgent] = makeProxy();

@Module({
  imports: [
    HttpModule.register({
      // httpAgent: httpsAgent,
      // httpsAgent,
    }),
  ],
})
export class WprogProviderModule {
  private static readonly logger = new Logger(WprogProviderModule.name);

  static register() {
    this.logger.log('Registered');

    return {
      module: WprogProviderModule,
      providers: [WprogService, WprogProvider],
      exports: [WprogService],
    };
  }
}
