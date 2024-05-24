import { Exclude, Expose } from 'class-transformer';
import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';

@Exclude()
export class PayloadAuthRestoreDto {
  /** @example Ц-22011 */
  @Expose()
  @IsString()
  @Length(7)
  public readonly cardNumber: string;

  /** @example 144919 */
  @Expose()
  @IsNumberString()
  @Length(6)
  public readonly passportNumber: string;

  @Expose()
  @IsString()
  @IsOptional()
  public readonly serviceToken: string;
}
