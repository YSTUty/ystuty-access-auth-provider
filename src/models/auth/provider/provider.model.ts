import { Global, Module } from '@nestjs/common';

import { ProviderService } from './provider.service';
import { YstutyProviderModule } from './ystuty-provider/ystuty-provider.model';
import { WprogProviderModule } from './wprog-provider/wprog-provider.model';
import { LdapProviderModule } from './ldap-provider/ldap-provider.model';

@Global()
@Module({
  imports: [
    YstutyProviderModule.register(),
    WprogProviderModule.register(),
    LdapProviderModule.register(),
  ],
  providers: [ProviderService],
  exports: [
    ProviderService,
    YstutyProviderModule,
    WprogProviderModule,
    LdapProviderModule,
  ],
})
export class ProviderModule {}
