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

@Controller()
@UseFilters(HttpExceptionFilter)
export class AuthMicroserviceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ method: 'validate' }, Transport.TCP)
  @UseInterceptors(ClassSerializerInterceptor)
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
}
