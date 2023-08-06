import { Global, Module } from '@nestjs/common';
import { WprogProviderModule } from './wprog-provider/wprog-provider.model';
import { LdapProviderModule } from './ldap-provider/ldap-provider.model';
import { ProviderService } from './provider.service';

@Global()
@Module({
  imports: [WprogProviderModule.register(), LdapProviderModule.register()],
  providers: [ProviderService],
  exports: [ProviderService, WprogProviderModule, LdapProviderModule],
})
export class ProviderModule {}
