import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Get,
  Query,
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
    // TODO: check payload.serviceToken

    const response = await this.authService.authUser(user);
    return response;
  }

  @Post('restore')
  @HttpCode(200)
  async postRestore(@Body() body: RequestAuthRestoreDto) {
    // TODO: check body.serviceToken

    const response = await this.authService.restoreAuth(
      body.cardNumber,
      body.passportNumber,
    );
    if (!response) {
      throw new BadRequestException();
    }
    return response;
  }

  @Get('marks')
  async getMarks(@Query('login') login: string) {
    if (!login) return null;
    const response = await this.authService.getMarks(login);
    if (!response) {
      throw new BadRequestException();
    }
    return response;
  }

  @Get('orders')
  async getOrders(@Query('login') login: string) {
    if (!login) return null;
    const response = await this.authService.getOrders(login);
    if (!response) {
      throw new BadRequestException();
    }
    return response;
  }
}
