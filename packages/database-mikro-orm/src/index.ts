import { AccountsMikroOrm } from './mikro-orm';
import { User } from './entity/User';
import { Email } from './entity/Email';
import { Service } from './entity/Service';
import { Session } from './entity/Session';
import { User as IUser } from '@accounts/types/lib/types/user';

const entities = [User, Email, Service, Session];

export { AccountsMikroOrm, IUser, User, Email, Service, Session, entities };
export default AccountsMikroOrm;
