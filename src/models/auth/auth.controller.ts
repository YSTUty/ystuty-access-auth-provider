import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  Version,
  BadRequestException,
} from '@nestjs/common';
import { ReqAuth } from '@my-common';

import { LocalAuthGuard } from './guards';
import { AuthService } from './auth.service';
import { RequestAuthRestoreDto } from './dto/request-auth-restore.dto';

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

  @Version('1')
  @Post('restore')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
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
