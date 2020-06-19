import 'reflect-metadata';
import {
  UserSchema,
  User,
  UserConstructor,
  UserEmail,
  UserService,
  UserSession,
  UserEmailConstructor,
} from '@accounts/mikro-orm';
import { ReflectMetadataProvider, Entity, Property } from 'mikro-orm';

type ExtendedUserConstructor = UserConstructor & {
  name: string;
  surname: string;
};

@Entity()
export class ExtendedUser extends User {
  @Property()
  name: string;

  @Property()
  surname: string;

  constructor({ name, surname, ...otherProps }: ExtendedUserConstructor) {
    super(otherProps);
    this.name = name;
    this.surname = surname;
  }
}

type ExtendedEmailConstructor = UserEmailConstructor & {
  randomAttribute: string;
};

@Entity()
export class ExtendedEmail extends UserEmail {
  @Property()
  randomAttribute: string;

  constructor({ randomAttribute, ...otherProps }: ExtendedEmailConstructor) {
    super(otherProps);
    this.randomAttribute = randomAttribute;
  }
}

export default {
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  entities: [
    //ExtendedUser,
    UserSchema({ emailEntity: UserEmail }),
    UserEmail,
    UserService,
    UserSession,
  ],
  dbName: 'accounts',
  user: 'postgres',
  password: 'very-secret',
  type: 'postgresql' as const,
  forceUtcTimezone: true,
  debug: true,
};
