import { IdentifiedReference, Reference } from 'mikro-orm';
import { User } from './User';

export class Email<CustomUser extends User<any, any, any>> {
  id!: number;

  user!: IdentifiedReference<CustomUser>;

  address: string;

  verified = false;

  constructor({ address, user, verified }: EmailCtorArgs<CustomUser>) {
    this.address = address.toLocaleLowerCase();
    if (user) {
      this.user = Reference.create(user);
    }
    if (verified) {
      this.verified = verified;
    }
  }
}

export interface EmailCtorArgs<CustomUser extends User<any, any, any>> {
  address: string;
  user?: CustomUser;
  verified?: boolean;
}

export type EmailCtor<CustomUser extends User<any, any, any>> = new (
  args: EmailCtorArgs<CustomUser>
) => Email<CustomUser>;

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
