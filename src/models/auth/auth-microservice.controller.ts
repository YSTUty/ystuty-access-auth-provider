import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  UseFilters,
  InternalServerErrorException,
} from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { HttpAndRpcExceptionFilter } from '@my-common';
import * as xEnv from '@my-environment';

import { AuthService } from './auth.service';
import { PayloadAuthValidateUserDto } from './dto/payload-auth-validate.dto';
import { PayloadAuthRestoreDto } from './dto/payload-auth-restore.dto';

@Controller()
@UseFilters(HttpAndRpcExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthMicroserviceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ method: 'validate' }, Transport.TCP)
  async validate(@Payload() payload: PayloadAuthValidateUserDto) {
    if (
      xEnv.MY_SERVICE_TOKEN &&
      xEnv.MY_SERVICE_TOKEN !== payload.serviceToken
    ) {
      throw new InternalServerErrorException('Bad service token');
    }

    const user = await this.authService.validateUser(
      payload.login,
      payload.password,
    );

    if (!user) {
      throw new BadRequestException('Invalid login or password');
    }
    const response = await this.authService.authUser(user);
    return response;
  }

  @MessagePattern({ method: 'restore' }, Transport.TCP)
  async restore(@Payload() payload: PayloadAuthRestoreDto) {
    if (
      xEnv.MY_SERVICE_TOKEN &&
      xEnv.MY_SERVICE_TOKEN !== payload.serviceToken
    ) {
      throw new InternalServerErrorException('Bad service token');
    }

    const response = await this.authService.restoreAuth(
      payload.cardNumber,
      payload.passportNumber,
    );

    if (!response) {
      throw new BadRequestException('Invalid confirm data');
    }
    return response;
  }
}
