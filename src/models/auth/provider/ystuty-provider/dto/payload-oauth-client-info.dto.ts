import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class PayloadGeneralUserValidateDto {
  @Expose()
  @IsString()
  public readonly login: string;

  @Expose()
  @IsString()
  public readonly password: string;

  @Expose()
  @IsString()
  @IsOptional()
  public readonly serviceToken: string;
}
