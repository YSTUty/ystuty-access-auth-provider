import { Exclude, Expose } from 'class-transformer';
import { IsNumberString, IsString, Length } from 'class-validator';

@Exclude()
export class RequestAuthRestoreDto {
  /** @example Ц-22011 */
  @Expose({ name: 'card_number', toClassOnly: true })
  @IsString()
  @Length(7)
  public readonly cardNumber: string;

  /** @example 144919 */
  @Expose({ name: 'passport_number', toClassOnly: true })
  @IsNumberString()
  @Length(6)
  public readonly passportNumber: string;
}
