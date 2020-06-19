import { IdentifiedReference, Reference } from 'mikro-orm';
import { User } from './User';
import { Service } from './Service';
import { Email } from './Email';

export class Session<
  CustomEmail extends Email<this, CustomService>,
  CustomService extends Service<CustomEmail, this>
> {
  id!: number;

  createdAt: Date = new Date();

  updatedAt: Date = new Date();

  user: IdentifiedReference<User<CustomEmail, this, CustomService>>;

  token: string;

  valid: boolean;

  userAgent?: string;

  ip?: string;

  extra?: object;

  constructor({
    user,
    token,
    valid,
    userAgent,
    ip,
    extra,
  }: {
    user: User<CustomEmail, this, CustomService>;
    token: string;
    valid: boolean;
    userAgent?: string | null;
    ip?: string | null;
    extra?: object;
  }) {
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

/*export type SessionCtorArgs<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> = {
  user: User<CustomEmail, CustomSession, CustomService>;
  token: string;
  valid: boolean;
  userAgent?: string | null;
  ip?: string | null;
  extra?: object;
};

export type SessionCtor<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> = new (args: SessionCtorArgs<CustomEmail, CustomSession, CustomService>) => Session<
  CustomEmail,
  CustomService
>;*/

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
