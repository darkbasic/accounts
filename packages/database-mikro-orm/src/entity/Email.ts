import { IdentifiedReference, Reference } from 'mikro-orm';
import { User } from './User';
import { Session } from './Session';
import { Service } from './Service';

export class Email<
  CustomSession extends Session<this, CustomService>,
  CustomService extends Service<this, CustomSession>
> {
  id!: number;

  user!: IdentifiedReference<User<this, CustomSession, CustomService>>;

  address: string;

  verified = false;

  constructor({
    address,
    user,
    verified,
  }: {
    address: string;
    user?: User<this, CustomSession, CustomService>;
    verified?: boolean;
  }) {
    this.address = address.toLocaleLowerCase();
    if (user) {
      this.user = Reference.create(user);
    }
    if (verified) {
      this.verified = verified;
    }
  }
}

export interface EmailCtorArgs<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> {
  address: string;
  user?: User<CustomEmail, CustomSession, CustomService>;
  verified?: boolean;
}

export type EmailCtor<
  CustomEmail extends Email<CustomSession, CustomService>,
  CustomSession extends Session<CustomEmail, CustomService>,
  CustomService extends Service<CustomEmail, CustomSession>
> = new (args: EmailCtorArgs<CustomEmail, CustomSession, CustomService>) => Email<
  CustomSession,
  CustomService
>;

/*export const getEmail = <
  CustomSession extends Session,
  CustomService extends Service<Email<CustomSession, CustomService>, CustomSession>
>({
  UserEntity,
  abstract = false,
}: {
  UserEntity?: UserCtor<Email<CustomSession, CustomService>, CustomSession, CustomService>;
  abstract?: boolean;
}) => {
  return new EntitySchema<Email<CustomSession, CustomService>>({
    class: Email,
    abstract,
    properties: {
      id: { type: 'number', primary: true },
      user: { reference: 'm:1', wrappedReference: true, type: UserEntity?.name ?? 'User' },
      address: { type: 'string' },
      verified: { type: 'boolean', default: 0, onCreate: () => false },
    },
  });
};*/
