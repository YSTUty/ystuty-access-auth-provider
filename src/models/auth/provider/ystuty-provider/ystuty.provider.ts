import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as rxjs from 'rxjs';

import * as xEnv from '@my-environment';
import { HttpRpcException, mutatorClientProxy } from '@my-common';

import { ResponseGeneralUser } from './dto/response-general-user.dto';
import { PayloadGeneralUserValidateDto } from './dto/payload-oauth-client-info.dto';
import { PayloadAuthRestoreDto } from './dto/payload-auth-restore.dto';
import { ResponseAuthRestore } from './dto/response-auth-restore.dto';

@Injectable()
export class YstutyProvider {
  private readonly logger = new Logger(YstutyProvider.name);
  @Inject('MS_S_GENERAL_SERVER')
  private readonly sGeneralServerClient: ClientProxy;

  public async startAuth(login: string, password: string) {
    const serviceToken = xEnv.S_GENERAL_SERVICE_TOKEN;
    try {
      const userInfo = await rxjs.firstValueFrom(
        this.sGeneralServerClient
          .send<Partial<ResponseGeneralUser>, PayloadGeneralUserValidateDto>(
            { entity: 'user', method: 'validate' },
            { login, password, serviceToken },
          )
          .pipe(...mutatorClientProxy(ResponseGeneralUser)),
      );

      return userInfo;
    } catch (err) {
      if (err instanceof HttpRpcException) {
        console.log(err, err.getStatus());
        if (err.getStatus() === 404) {
          // ...
        }
      } else {
        console.log(err);
      }

      return null;
    }
  }

  public async startRestore(cardNumber: string, passportNumber: string) {
    if (cardNumber.length < 5 || passportNumber.length < 6) {
      return false;
    }

    const serviceToken = xEnv.S_GENERAL_SERVICE_TOKEN;
    try {
      const userInfo = await rxjs.firstValueFrom(
        this.sGeneralServerClient
          .send<Partial<ResponseAuthRestore>, PayloadAuthRestoreDto>(
            { entity: 'user', method: 'restore' },
            { cardNumber, passportNumber, serviceToken },
          )
          .pipe(...mutatorClientProxy(ResponseAuthRestore)),
      );

      return userInfo;
    } catch (err) {
      // if (err instanceof HttpRpcException) {
      //   console.log(err, err.getStatus());
      //   if (err.getStatus() === 404) {
      //     // ...
      //   }
      // } else {
      //   console.log(err);
      // }

      return null;
    }
  }
}
