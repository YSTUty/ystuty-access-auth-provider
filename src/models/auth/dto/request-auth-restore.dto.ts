import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class RequestAuthRestoreDto {
  /** @example Ц-22011 */
  @Expose()
  public readonly cardNumber: string;

  @Expose()
  public readonly passportNumber: string;

  @Expose()
  @IsString()
  @IsOptional()
  public readonly serviceToken: string;
}
