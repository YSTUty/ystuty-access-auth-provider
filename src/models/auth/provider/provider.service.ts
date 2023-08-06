import { Injectable } from '@nestjs/common';
import * as xEnv from '@my-environment';

import { LdapService } from './ldap-provider/ldap.service';
import { WprogService } from './wprog-provider/wprog.service';

@Injectable()
export class ProviderService {
  constructor(
    private readonly ldapService: LdapService,
    private readonly wprogService: WprogService,
  ) {}

  public async auth(login: string, password: string) {
    // if (xEnv.LDAP) {
    //   return this.ldapService.auth(login, password);
    // }
    if (xEnv.WPROG_URL) {
      return this.wprogService.auth(login, password);
    }

    throw new Error('Wrong provider');
  }
}
