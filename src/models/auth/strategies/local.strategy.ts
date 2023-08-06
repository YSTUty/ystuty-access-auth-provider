import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthService)
  private readonly authService: AuthService;

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    return user;
  }
}
