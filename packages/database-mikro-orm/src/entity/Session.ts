import { IdentifiedReference, Reference } from 'mikro-orm';
import { User } from './User';

export class Session<CustomUser extends User<any, any, any>> {
  id!: number;

  createdAt: Date = new Date();

  updatedAt: Date = new Date();

  user: IdentifiedReference<CustomUser>;

  token: string;

  valid: boolean;

  userAgent?: string;

  ip?: string;

  extra?: object;

  constructor({ user, token, valid, userAgent, ip, extra }: SessionCtorArgs<CustomUser>) {
    this.user = Reference.create(user);
    this.token = token;
    this.valid = valid;
    if (userAgent) {
      this.userAgent = userAgent;
    }
    if (ip) {
      this.ip = ip;
    }
    if (extra) {
      this.extra = extra;
    }
  }
}

export type SessionCtorArgs<CustomUser extends User<any, any, any>> = {
  user: CustomUser;
  token: string;
  valid: boolean;
  userAgent?: string | null;
  ip?: string | null;
  extra?: object;
};

export type SessionCtor<CustomUser extends User<any, any, any>> = new (
  args: SessionCtorArgs<CustomUser>
) => Session<CustomUser>;

/*@Entity()
export class UserSession {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => User, { wrappedReference: true })
  user: IdentifiedReference<User>;

  @Property()
  token: string;

  @Property()
  valid: boolean;

  @Property({ nullable: true })
  userAgent?: string;

  @Property({ nullable: true })
  ip?: string;

  @Property({ type: 'json', nullable: true })
  extra?: object;

  constructor({ user, token, valid, userAgent, ip, extra }: SessionCtorArgs) {
    this.user = Reference.create(user);
    this.token = token;
    this.valid = valid;
    if (userAgent) {
      this.userAgent = userAgent;
    }
    if (ip) {
      this.ip = ip;
    }
    if (extra) {
      this.extra = extra;
    }
  }
}*/
