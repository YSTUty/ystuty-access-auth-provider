import { Injectable } from '@nestjs/common';

import { LdapProvider } from './ldap.provider';

@Injectable()
export class LdapService {
  constructor(private readonly provider: LdapProvider) {}

  public async auth(login: string, password: string) {
    const lkstudResponse = await this.provider.startAuth(login, password);
    if (!lkstudResponse) {
      throw new Error('Failed auth');
    }

    return {};
  }
}
