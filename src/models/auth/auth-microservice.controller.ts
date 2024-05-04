import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from '@my-common';

import { AuthService } from './auth.service';
import { PayloadAuthValidateUserDto } from './dto/payload-auth-validate.dto';
import { PayloadAuthRestoreDto } from './dto/payload-auth-restore.dto';

@Controller()
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthMicroserviceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ method: 'validate' }, Transport.TCP)
  async validate(@Payload() payload: PayloadAuthValidateUserDto) {
    const user = await this.authService.validateUser(
      payload.username,
      payload.password,
    );

    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }
    const response = await this.authService.authUser(user);
    return response;
  }

  @MessagePattern({ method: 'restore' }, Transport.TCP)
  async restore(@Payload() payload: PayloadAuthRestoreDto) {
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
