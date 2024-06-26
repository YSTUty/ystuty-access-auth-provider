import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

@Exclude()
export class PayloadAuthValidateUserDto {
  @Expose()
  @IsString()
  @Length(1, 40)
  public readonly login: string;

  @Expose()
  @IsString()
  @Length(1, 255)
  public readonly password: string;

  @Expose()
  @IsString()
  @IsOptional()
  public readonly serviceToken: string;
}
