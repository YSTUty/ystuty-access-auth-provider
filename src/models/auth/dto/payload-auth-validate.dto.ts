import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

@Exclude()
export class PayloadAuthValidateUserDto {
  @Expose()
  @IsString()
  @Length(1, 40)
  public readonly username: string;

  @Expose()
  @IsString()
  @Length(1, 255)
  public readonly password: string;
}
