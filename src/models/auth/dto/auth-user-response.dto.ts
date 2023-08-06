import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../entity/user.entity';

export class AuthUserResponseDto {
  public readonly user: UserEntity;

  constructor(input?: Partial<AuthUserResponseDto>) {
    if (input) {
      Object.assign(this, plainToInstance(AuthUserResponseDto, input));
    }
  }
}
