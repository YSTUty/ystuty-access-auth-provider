import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { ReqAuth } from '@my-common';
import * as xEnv from '@my-environment';

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
  async postSignin(@ReqAuth() user, @Req() req: Request) {
    if (
      xEnv.MY_SERVICE_TOKEN &&
      xEnv.MY_SERVICE_TOKEN !== req.body.serviceToken
    ) {
      throw new InternalServerErrorException('Bad service token');
    }

    const response = await this.authService.authUser(user);
    return response;
  }

  @Post('restore')
  @HttpCode(200)
  async postRestore(@Body() body: RequestAuthRestoreDto) {
    if (xEnv.MY_SERVICE_TOKEN && xEnv.MY_SERVICE_TOKEN !== body.serviceToken) {
      throw new InternalServerErrorException('Bad service token');
    }

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
