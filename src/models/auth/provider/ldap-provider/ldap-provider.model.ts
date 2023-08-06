import { Logger, Module } from '@nestjs/common';

import { LdapService } from './ldap.service';
import { LdapProvider } from './ldap.provider';

@Module({
  imports: [],
})
export class LdapProviderModule {
  private static readonly logger = new Logger(LdapProviderModule.name);

  static register() {
    this.logger.log('Registered');

    return {
      module: LdapProviderModule,
      providers: [LdapService, LdapProvider],
      exports: [LdapService],
    };
  }
}
