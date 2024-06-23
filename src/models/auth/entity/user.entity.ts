import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class UserEntity {
  @Expose()
  public login: string;

  @Expose()
  public email: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public patronymic: string;

  // @Expose()
  public password: string;

  @Expose()
  public birthday: string;

  @Expose()
  public emails: string[];

  @Expose()
  public telephones: string[];

  @Expose()
  public ticketId: string;

  @Expose()
  public photoUrl: string;

  constructor(input?: Omit<Partial<UserEntity>, 'toResponseObject'>) {
    if (input) {
      Object.assign(this, plainToClass(UserEntity, input));
    }
  }

  // public toResponseObject({ forMe }: { forMe?: boolean } = {}) {
  //   const { id, login, orders: data, updatedAt } = this;
  //   return {
  //     id,
  //     login,
  //     ...(forMe && {
  //       data: data?.map((e) => e.toResponseObject()),
  //       updated_at: updatedAt,
  //     }),
  //   };
  // }

  @Expose()
  public get fullName() {
    return (
      [this.lastName, this.firstName, this.patronymic]
        .filter(Boolean)
        .join(' ')
        .trim() || null
    );
  }

  @Expose()
  public get initials() {
    const firstName = this.firstName && `${this.firstName.slice(0, 1)}.`;
    const patronymic = this.patronymic && `${this.patronymic.slice(0, 1)}.`;
    return (
      [this.lastName, firstName, patronymic].filter(Boolean).join(' ').trim() ||
      null
    );
  }
}
