import 'reflect-metadata';
import {
  User,
  UserCtorArgs,
  getUserSchema,
  Email,
  EmailCtorArgs,
  getEmailSchema,
  Service,
  Session,
  getServiceSchema,
  getSessionSchema,
} from '@accounts/mikro-orm';
import { ReflectMetadataProvider, Entity, Property } from 'mikro-orm';

type ExtendedUserCtorArgs = UserCtorArgs & {
  name: string;
  surname: string;
};

@Entity()
export class ExtendedUser extends User<
  ExtendedEmail,
  Session<ExtendedUser>,
  Service<ExtendedUser>
> {
  @Property()
  name: string;

  @Property()
  surname: string;

  constructor({ name, surname, ...otherProps }: ExtendedUserCtorArgs) {
    super(otherProps);
    this.name = name;
    this.surname = surname;
  }
}

type ExtendedEmailCtorArgs = EmailCtorArgs<ExtendedUser> & {
  randomAttribute: string;
};

@Entity()
export class ExtendedEmail extends Email<ExtendedUser> {
  @Property()
  randomAttribute: string;

  constructor({ randomAttribute, ...otherProps }: ExtendedEmailCtorArgs) {
    super(otherProps);
    this.randomAttribute = randomAttribute;
  }
}

export default {
  metadataProvider: ReflectMetadataProvider,
  cache: { enabled: false },
  entities: [
    ExtendedUser,
    getUserSchema({ EmailEntity: ExtendedEmail, abstract: true }),
    ExtendedEmail,
    getEmailSchema({ UserEntity: ExtendedUser, abstract: true }),
    getServiceSchema({ UserEntity: ExtendedUser }),
    getSessionSchema({ UserEntity: ExtendedUser }),
  ],
  dbName: 'accounts',
  user: 'postgres',
  password: 'very-secret',
  type: 'postgresql' as const,
  forceUtcTimezone: true,
  debug: true,
};
