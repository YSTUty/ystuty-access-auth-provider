import { Injectable } from '@nestjs/common';
import * as xEnv from '@my-environment';

import { YstutyService } from './ystuty-provider/ystuty.service';
import { WprogService } from './wprog-provider/wprog.service';
import { LdapService } from './ldap-provider/ldap.service';

@Injectable()
export class ProviderService {
  constructor(
    private readonly ystutyService: YstutyService,
    private readonly ldapService: LdapService,
    private readonly wprogService: WprogService,
  ) {}

  public async auth(login: string, password: string) {
    if (xEnv.MS_S_GENERAL_SERVER_HOST) {
      return this.ystutyService.auth(login, password);
    }

    // if (xEnv.LDAP) {
    //   return this.ldapService.auth(login, password);
    // }

    if (xEnv.WPROG_URL) {
      return this.wprogService.auth(login, password);
    }

    throw new Error('Wrong provider');
  }

  public async restore(cardNumber: string, passportNumber: string) {
    // if (xEnv.MS_S_GENERAL_SERVER_HOST) {
    //   return this.ystutyService.restore(cardNumber, passportNumber);
    // }

    if (xEnv.WPROG_URL) {
      return this.wprogService.restore(cardNumber, passportNumber);
    }

    throw new Error('Wrong provider');
  }

  public async getMarks(login: string) {
    if (xEnv.WPROG_URL) {
      return this.wprogService.getStudInfo(login, 'lkstud_oc');
    }

    throw new Error('Wrong provider');
  }

  public async getOrders(login: string) {
    if (xEnv.WPROG_URL) {
      return this.wprogService.getStudInfo(login, 'lkorder');
    }

    throw new Error('Wrong provider');
  }
}
