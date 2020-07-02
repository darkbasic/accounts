import { GraphQLModule } from '@graphql-modules/core';
import { ProviderScope } from '@graphql-modules/di';
import { mergeTypeDefs } from '@graphql-toolkit/schema-merging';
import { User, ConnectionInformations, AuthenticationService } from '@accounts/types';
import { AccountsServer, AccountsServerOptions } from '@accounts/server';
import AccountsPassword from '@accounts/password';
import { IncomingMessage } from 'http';
import TypesTypeDefs from './schema/types';
import getQueryTypeDefs from './schema/query';
import getMutationTypeDefs from './schema/mutation';
import getSchemaDef from './schema/schema-def';
import { Query } from './resolvers/query';
import { Mutation } from './resolvers/mutation';
import { User as UserResolvers } from './resolvers/user';
import { AccountsPasswordModule } from '../accounts-password';
import { AuthenticatedDirective } from '../../utils/authenticated-directive';
import { context } from '../../utils';
import { CoreAccountsModule } from '../core';
import { Services } from './services.symbol';
import AccountsOauth from '@accounts/oauth';

export interface AccountsRequest {
  req: IncomingMessage;
}

class MyClass1 {
  constructor(a: string) {
    console.log(a);
  }
  a() {
    console.log('a');
  }
}

class MyClass2 {
  constructor(a: number, b: string) {
    console.log(a);
    console.log(b);
  }
  b() {
    console.log('b');
  }
}

type Constructor<T, P extends any[]> = new (...args: P) => T;

type CtorEntry<T extends Constructor<any, any>> = T extends Constructor<any, infer P>
  ? [T, P]
  : never;

const centry1: CtorEntry<typeof MyClass1> = [MyClass1, ['abc']];
const centry2: CtorEntry<typeof MyClass2> = [MyClass2, [5, 'abc']];

type InstEntry<T extends Constructor<any, any>> = T extends Constructor<infer I, any>
  ? [T, I]
  : never;

const ientry1: InstEntry<typeof MyClass1> = [MyClass1, new MyClass1('abc')];
const ientry2: InstEntry<typeof MyClass2> = [MyClass2, new MyClass2(5, 'abc')];

type ValuesOf<T extends any[]> = T[number];

type CtorEntries<T extends Array<Constructor<any, any>>> = Array<CtorEntry<ValuesOf<T>>>;

const centries: CtorEntries<[typeof MyClass1, typeof MyClass2]> = [
  [MyClass1, ['abc']],
  [MyClass2, [5, 'abc']],
];

type InstEntries<T extends Array<Constructor<any, any>>> = Array<InstEntry<ValuesOf<T>>>;

const ientries: InstEntries<[typeof MyClass1, typeof MyClass2]> = [
  [MyClass1, new MyClass1('abc')],
  [MyClass2, new MyClass2(5, 'abc')],
];

interface CtorMap<T extends Array<Constructor<any, any>>> {
  clear(): void;
  delete(key: ValuesOf<T>): boolean;
  forEach(
    callbackfn: (value: CtorEntry<ValuesOf<T>>[1], key: ValuesOf<T>, map: CtorMap<T>) => void,
    thisArg?: any
  ): void;
  get<K extends ValuesOf<T>>(key: K): CtorEntry<K>[1] | undefined;
  has(key: ValuesOf<T>): boolean;
  set<K extends ValuesOf<T>>(key: K, value: CtorEntry<K>[1]): this;
  readonly size: number;

  [Symbol.iterator](): IterableIterator<[ValuesOf<T>, CtorEntry<ValuesOf<T>>[1]]>;
  entries(): IterableIterator<[ValuesOf<T>, CtorEntry<ValuesOf<T>>[1]]>;
  keys(): IterableIterator<ValuesOf<T>>;
  values(): IterableIterator<CtorEntry<ValuesOf<T>>[1]>;
}

interface CtorMapConstructor {
  new (): CtorMap<any>;
  new <T extends Array<Constructor<any, any>>>(entries?: CtorEntries<T>): CtorMap<T>;
  readonly prototype: CtorMap<any>;
}

interface InstMap<T extends Array<Constructor<any, any>>> {
  clear(): void;
  delete(key: ValuesOf<T>): boolean;
  forEach(
    callbackfn: (value: InstEntry<ValuesOf<T>>[1], key: ValuesOf<T>, map: InstMap<T>) => void,
    thisArg?: any
  ): void;
  get<K extends ValuesOf<T>>(key: K): InstEntry<K>[1] | undefined;
  has(key: ValuesOf<T>): boolean;
  set<K extends ValuesOf<T>>(key: K, value: InstEntry<K>[1]): this;
  readonly size: number;

  [Symbol.iterator](): IterableIterator<[ValuesOf<T>, InstEntry<ValuesOf<T>>[1]]>;
  entries(): IterableIterator<[ValuesOf<T>, InstEntry<ValuesOf<T>>[1]]>;
  keys(): IterableIterator<ValuesOf<T>>;
  values(): IterableIterator<InstEntry<ValuesOf<T>>[1]>;
}

interface InstMapConstructor {
  new (): InstMap<any>;
  new <T extends Array<Constructor<any, any>>>(entries?: InstEntries<T>): InstMap<T>;
  readonly prototype: InstMap<any>;
}
declare const Map: InstMapConstructor;

const mymap1 = new Map(centries);
const mymap2 = new Map<[typeof MyClass1, typeof MyClass2]>([
  [MyClass1, new MyClass1('abc')],
  [MyClass2, new MyClass2(5, 'abc')],
]);

const makeEntries = <T extends Array<Constructor<any, any>>>(entries: CtorEntries<T>) => entries;

const res: CtorEntries<[typeof MyClass1, typeof MyClass2]> = makeEntries([
  [MyClass1, ['abc']],
  [MyClass2, [5, 'abc']],
]);

console.log(centry1);
console.log(centry2);
console.log(ientry1);
console.log(ientry2);
console.log(centries);
console.log(ientries);
console.log(mymap1);
console.log(mymap2);
console.log(res);

export interface AccountsModuleConfig<
  CustomUser extends User = User,
  IServices extends Array<Constructor<any, any>> = [typeof AccountsPassword, typeof AccountsOauth]
> {
  scope?: ProviderScope;
  options: AccountsServerOptions<CustomUser>;
  services: CtorMap<IServices>;
  rootQueryName?: string;
  rootMutationName?: string;
  extendTypeDefs?: boolean;
  withSchemaDefinition?: boolean;
  headerName?: string;
  userAsInterface?: boolean;
  excludeAddUserInContext?: boolean;
}

export interface AccountsModuleContext<IUser = User> {
  authToken?: string;
  user?: IUser;
  userId?: string;
  userAgent: string | null;
  ip: string | null;
  infos: ConnectionInformations;
}

// You can see the below. It is really easy to create a reusable GraphQL-Module with different configurations

export const AccountsModule: GraphQLModule<
  AccountsModuleConfig,
  AccountsRequest,
  AccountsModuleContext
> = new GraphQLModule<AccountsModuleConfig, AccountsRequest, AccountsModuleContext>({
  name: 'accounts',
  typeDefs: ({ config }) =>
    mergeTypeDefs(
      [
        TypesTypeDefs,
        getQueryTypeDefs(config),
        getMutationTypeDefs(config),
        ...getSchemaDef(config),
      ],
      {
        useSchemaDefinition: config.withSchemaDefinition,
      }
    ),
  resolvers: ({ config }) =>
    ({
      [config.rootQueryName || 'Query']: Query,
      [config.rootMutationName || 'Mutation']: Mutation,
      User: UserResolvers,
    } as any),
  // If necessary, import AccountsPasswordModule together with this module
  imports: ({ config }) => {
    return [
      CoreAccountsModule.forRoot({
        userAsInterface: config.userAsInterface,
      }),
      ...(config.services.has(AccountsPassword)
        ? [
            /*AccountsPasswordModule.forRoot({
              accountsPassword: config.services.password as AccountsPassword,
              ...config,
            }),*/
          ]
        : []),
    ];
  },
  providers: ({ config: { scope = ProviderScope.Application, options, services }, injector }) => [
    {
      provide: Services,
      scope,
      useFactory: () => new Map(Array.from(services).map(([k, v]) => [k, new k(v as any)] as any)),
    },
    ...(services.has(AccountsPassword)
      ? [
          {
            provide: AccountsPassword,
            scope,
            useFactory: () => {
              const zg = services.get(AccountsPassword)!;
              console.log(zg);
              return new AccountsPassword(...services.get(AccountsPassword)!);
            },
          },
        ]
      : []),
    ...(services.has(AccountsOauth)
      ? [
          {
            provide: AccountsOauth,
            scope,
            useFactory: () => new AccountsOauth(...services.get(AccountsOauth)!),
          },
        ]
      : []),
    {
      provide: AccountsServer,
      scope,
      useFactory: () => new AccountsServer(options, injector.get(Services)),
    },
  ],
  context: context('accounts'),
  schemaDirectives: {
    auth: AuthenticatedDirective,
  },
  configRequired: true,
});
