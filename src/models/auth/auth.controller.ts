import {
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ReqAuth } from '@my-common';

import { LocalAuthGuard } from './guards';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('signin')
  @UseGuards(/* CaptchaGuard, */ LocalAuthGuard)
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  async postSignin(@ReqAuth() user) {
    const response = await this.authService.authUser(user);
    return response;
  }
}
