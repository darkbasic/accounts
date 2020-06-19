import { IdentifiedReference, Reference } from 'mikro-orm';
import { User } from './User';

export class Service<CustomUser extends User<any, any, any>> {
  id!: number;

  user!: IdentifiedReference<CustomUser>;

  name: string;

  token?: string;

  options?: object;

  constructor({ name, user, password }: ServiceCtorArgs<CustomUser>) {
    this.name = name;

    if (user) {
      this.user = Reference.create(user);
    }

    if (password) {
      this.options = { bcrypt: password };
    }
  }
}

export type ServiceCtorArgs<CustomUser extends User<any, any, any>> = {
  name: string;
  user?: CustomUser;
  password?: string;
};

export type ServiceCtor<CustomUser extends User<any, any, any>> = new (
  args: ServiceCtorArgs<CustomUser>
) => Service<CustomUser>;

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
