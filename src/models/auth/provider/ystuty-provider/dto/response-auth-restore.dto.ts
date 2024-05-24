import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class ResponseAuthRestore {
  @Expose()
  public fullName: string;

  @Expose()
  public login: string;

  @Expose()
  public password: string;

  @Expose()
  public email: string;

  constructor(input?: Partial<ResponseAuthRestore>) {
    if (input) {
      Object.assign(this, plainToClass(ResponseAuthRestore, input));
    }
  }
}
