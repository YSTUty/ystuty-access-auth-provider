import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { ProviderService } from './provider/provider.service';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly providerService: ProviderService) {}

  public async validateUser(login: string, password: string) {
    let user: UserEntity | null = null;

    try {
      const response = await this.providerService.auth(login, password);

      user = new UserEntity({
        login,
        password,
        firstName: response.first_name,
        lastName: response.last_name,
        patronymic: response.middle_name,
        birthday: response.birthday,
        emails: response.emails,
        ticketId: response.ticketId,
        avatarUrl: response.avatar_url,
      });
    } catch (err) {
      if (err.message === 'Wrong login:password') {
        throw new UnauthorizedException('Wrong login or password');
      }
      this.logger.error(err);
      return null;
    }

    return user;
  }

  public async restoreAuth(cardNumber: string, passportNumber: string) {
    try {
      const response = await this.providerService.restore(
        cardNumber,
        passportNumber,
      );

      return response;
    } catch (err) {
      if ((err as Error).message.startsWith('Wrong login:password')) {
        throw new UnauthorizedException('Wrong confirm data');
      }
      this.logger.error(err);
    }
    return null;
  }

  /** @deprecated // TODO: REMOVE IT */
  public async getMarks(login: string) {
    try {
      const response = await this.providerService.getMarks(login);

      return response;
    } catch (err) {
      if ((err as Error).message.startsWith('Wrong session')) {
        throw new UnauthorizedException('Need reauthorize');
      }
      this.logger.error(err);
    }
    return null;
  }

  /** @deprecated // TODO: REMOVE IT */
  public async getOrders(login: string) {
    try {
      const response = await this.providerService.getOrders(login);

      return response;
    } catch (err) {
      if ((err as Error).message.startsWith('Wrong session')) {
        throw new UnauthorizedException('Need reauthorize');
      }
      this.logger.error(err);
    }
    return null;
  }

  public async authUser(user: UserEntity) {
    // ? return access token
    return new AuthUserResponseDto({ user });
  }
}
