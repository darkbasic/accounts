import { IdentifiedReference, Reference } from 'mikro-orm';
import { User } from './User';
import { Session } from './Session';
import { Email } from './Email';

export class Service<
  CustomEmail extends Email<CustomSession, this>,
  CustomSession extends Session<CustomEmail, this>
> {
  id!: number;

  user!: IdentifiedReference<User<CustomEmail, CustomSession, this>>;

  name: string;

  token?: string;

  options?: object;

  constructor({
    name,
    user,
    password,
  }: {
    name: string;
    user?: User<CustomEmail, CustomSession, this>;
    password?: string;
  }) {
    this.name = name;

    if (user) {
      this.user = Reference.create(user);
    }

    if (password) {
      this.options = { bcrypt: password };
    }
  }
}

export type ServiceCtorArgs<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> = {
  name: string;
  user?: User<CustomEmail, CustomSession, CustomService>;
  password?: string;
};

export type ServiceCtor<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> = new (args: ServiceCtorArgs<CustomEmail, CustomSession, CustomService>) => Service<
  CustomEmail,
  CustomSession
>;

/*@Entity()
export class UserService {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { wrappedReference: true })
  user!: IdentifiedReference<User>;

  @Property()
  name: string;

  @Property({ nullable: true })
  token?: string;

  @Property({ type: 'json', nullable: true })
  options?: object;

  constructor({ name, user, password }: ServiceCtorArgs) {
    this.name = name;

    if (user) {
      this.user = Reference.create(user);
    }

    if (password) {
      this.options = { bcrypt: password };
    }
  }
}*/
