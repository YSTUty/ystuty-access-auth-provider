import { Exclude, Expose, plainToClass } from 'class-transformer';

// TODO!: test data format!
@Exclude()
export class ResponseGeneralUser {
  @Expose()
  public first_name: string;

  @Expose()
  public last_name: string;

  @Expose()
  public middle_name: string;

  @Expose()
  public birthday: string;

  @Expose()
  public emails: string[];

  @Expose()
  public ticketId: string;

  @Expose()
  public photo_url: string;

  @Expose()
  public login: string;

  @Expose()
  public group: string;

  constructor(input?: Partial<ResponseGeneralUser>) {
    if (input) {
      Object.assign(this, plainToClass(ResponseGeneralUser, input));
    }
  }
}
