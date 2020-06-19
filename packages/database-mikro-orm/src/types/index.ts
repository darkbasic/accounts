import { User } from '../entity/User';
import { Email } from '../entity/Email';
import { Service } from '../entity/Service';
import { Session } from '../entity/Session';
import { EntityManager } from 'mikro-orm';

export interface AccountsMikroOrmOptions {
  em: EntityManager;
  UserEntity?: typeof User;
  ServiceEntity?: typeof Service;
  EmailEntity?: typeof Email;
  SessionEntity?: typeof Session;
}
