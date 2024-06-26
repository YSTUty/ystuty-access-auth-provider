import { Injectable } from '@nestjs/common';
import { YstutyProvider } from './ystuty.provider';

@Injectable()
export class YstutyService {
  constructor(private readonly provider: YstutyProvider) {}

  public async auth(login: string, password: string) {
    const response = await this.provider.startAuth(login, password);
    if (!response) {
      throw new Error('Failed auth');
    }

    return response;
  }

  public async restore(cardNumber: string, passportNumber: string) {
    const response = await this.provider.startRestore(
      cardNumber,
      passportNumber,
    );
    if (!response) {
      throw new Error('Failed restore');
    }

    return response;
  }
}
