import { Injectable } from '@nestjs/common';

import { WprogProvider } from './wprog.provider';
import * as cherrioParser from './cherrio.parser';

@Injectable()
export class WprogService {
  constructor(private readonly provider: WprogProvider) {}

  public async auth(login: string, password: string) {
    const lkstudResponse = await this.provider.startAuth(login, password);
    if (!lkstudResponse) {
      throw new Error('Failed auth');
    }

    return cherrioParser.geUserInfo(lkstudResponse);
  }
}
