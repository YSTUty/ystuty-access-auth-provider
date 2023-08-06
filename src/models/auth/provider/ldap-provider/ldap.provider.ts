import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LdapProvider {
  private readonly logger = new Logger(LdapProvider.name);

  public async startAuth(login: string, password: string) {
    return null;
  }
}
