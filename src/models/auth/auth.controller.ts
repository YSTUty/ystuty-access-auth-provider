import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ReqAuth } from '@my-common';

import { LocalAuthGuard } from './guards';
import { AuthService } from './auth.service';
import { RequestAuthRestoreDto } from './dto/request-auth-restore.dto';

@Controller({ path: 'auth', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UseGuards(/* CaptchaGuard, */ LocalAuthGuard)
  @HttpCode(200)
  async postSignin(@ReqAuth() user) {
    const response = await this.authService.authUser(user);
    return response;
  }

  @Post('restore')
  @HttpCode(200)
  async postRestore(@Body() body: RequestAuthRestoreDto) {
    const response = await this.authService.restoreAuth(
      body.cardNumber,
      body.passportNumber,
    );
    if (!response) {
      throw new BadRequestException();
    }
    return response;
  }
}
