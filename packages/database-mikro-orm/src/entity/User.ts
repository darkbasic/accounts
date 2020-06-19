import { Collection } from 'mikro-orm';
import { Service, ServiceCtor } from './Service';
import { Email, EmailCtor } from './Email';
import { Session } from './Session';

export class User<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> {
  id!: number;

  username?: string;

  services = new Collection<CustomService | Service<CustomEmail, CustomSession>>(this);

  emails = new Collection<CustomEmail | Email<CustomSession, CustomService>>(this);

  sessions = new Collection<CustomSession | Session<CustomEmail, CustomService>>(this);

  deactivated = false;

  createdAt = new Date();

  updatedAt = new Date();

  constructor({
    EmailEntity,
    ServiceEntity,
    email,
    password,
    username,
  }: {
    EmailEntity: EmailCtor<CustomEmail, CustomSession, CustomService>;
    ServiceEntity: ServiceCtor<CustomEmail, CustomSession, CustomService>;
    email?: string;
    password?: string;
    username?: string;
  }) {
    if (username) {
      this.username = username;
    }
    if (email) {
      this.emails.add(new EmailEntity({ address: email }));
    }
    if (password) {
      this.services.add(new ServiceEntity({ name: 'password', password }));
    }
  }
}

/*export interface UserCtorArgs<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> {
  EmailEntity: EmailCtor<CustomEmail, CustomSession, CustomService>;
  ServiceEntity: ServiceCtor<CustomEmail, CustomSession, CustomService>;
  email?: string;
  password?: string;
  username?: string;
}

export type UserCtor<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> = new (args: UserCtorArgs<CustomEmail, CustomSession, CustomService>) => User<
  CustomEmail,
  CustomSession,
  CustomService
>;*/

/*export const getUserSchema = <
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session,
  CustomService extends Service
>({
  EmailEntity = Email,
  SessionEntity = Session,
  ServiceEntity = Service,
  abstract = false,
}: {
  EmailEntity?: EmailCtor<CustomSession, CustomService>;
  SessionEntity?: SessionCtor<CustomSession | Session>;
  ServiceEntity?: ServiceCtor<CustomService | Service>;
  abstract?: boolean;
} = {}) => {
  return new EntitySchema<User<CustomEmail, CustomSession, CustomService>>({
    class: User,
    abstract,
    properties: {
      id: { type: 'number', primary: true },
      createdAt: { type: 'Date', onCreate: () => new Date(), nullable: true },
      updatedAt: {
        type: 'Date',
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        nullable: true,
      },
      username: { type: 'string', nullable: true },
      deactivated: { type: 'boolean', default: 0, onCreate: () => false },
      services: {
        reference: '1:m',
        entity: () => ServiceEntity?.name ?? Service.name,
        mappedBy: (service) => service.user,
      },
      emails: {
        reference: '1:m',
        entity: () => EmailEntity?.name ?? Email.name,
        mappedBy: (email) => email.user,
      },
      sessions: {
        reference: '1:m',
        entity: () => SessionEntity?.name ?? Session.name,
        mappedBy: (session) => session.user,
      },
    },
  });
};*/

/*export interface UserCtorArgs {
  email?: string;
  password?: string;
  username?: string;
}

export type UserCtor<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends UserSession,
  CustomService extends UserService
> = new (args: UserCtorArgs) => IUser<CustomEmail, CustomSession, CustomService>;

export interface IUser<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends UserSession,
  CustomService extends UserService
> {
  id: number;
  username?: string;
  services: Collection<CustomService | UserService>;
  emails: Collection<CustomEmail | Email<CustomSession, CustomService>>;
  sessions: Collection<CustomSession | UserSession>;
  deactivated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const getUserClass = <
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends UserSession,
  CustomService extends UserService
>({
  EmailEntity = Email,
  ServiceEntity = UserService,
}: {
  EmailEntity?: EmailCtor<CustomSession, CustomService>;
  ServiceEntity?: ServiceCtor<CustomService | UserService>;
} = {}) =>
  class User implements IUser<CustomEmail, CustomSession, CustomService> {
    id!: number;

    username?: string;

    services = new Collection<CustomService | UserService>(this);

    emails = new Collection<CustomEmail | Email<CustomSession, CustomService>>(this);

    sessions = new Collection<CustomSession | UserSession>(this);

    deactivated = false;

    createdAt = new Date();

    updatedAt = new Date();

    constructor({ email, password, username }: UserCtorArgs) {
      if (username) {
        this.username = username;
      }
      if (email) {
        this.emails.add(new EmailEntity({ address: email }));
      }
      if (password) {
        this.services.add(new ServiceEntity({ name: 'password', password }));
      }
    }
  };

export const getUser = <
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends UserSession,
  CustomService extends UserService
>({
  EmailEntity = Email,
  SessionEntity = UserSession,
  ServiceEntity = UserService,
  abstract = false,
}: {
  EmailEntity?: EmailCtor<CustomSession, CustomService>;
  SessionEntity?: SessionCtor<CustomSession | UserSession>;
  ServiceEntity?: ServiceCtor<CustomService | UserService>;
  abstract?: boolean;
}) => {
  const UserClass = getUserClass({ EmailEntity, ServiceEntity });
  const schema = new EntitySchema<IUser<CustomEmail, CustomSession, CustomService>>({
    class: UserClass,
    abstract,
    properties: {
      id: { type: 'number', primary: true },
      createdAt: { type: 'Date', onCreate: () => new Date(), nullable: true },
      updatedAt: {
        type: 'Date',
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        nullable: true,
      },
      username: { type: 'string', nullable: true },
      deactivated: { type: 'boolean', default: 0, onCreate: () => false },
      services: {
        reference: '1:m',
        entity: () => ServiceEntity?.name ?? UserService.name,
        mappedBy: (service) => service.user,
      },
      emails: {
        reference: '1:m',
        entity: () => EmailEntity?.name ?? Email.name,
        mappedBy: (email) => email.user,
      },
      sessions: {
        reference: '1:m',
        entity: () => SessionEntity?.name ?? UserSession.name,
        mappedBy: (session) => session.user,
      },
    },
  });
  return { class: UserClass, schema };
};*/
