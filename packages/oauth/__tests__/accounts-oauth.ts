import { User, DatabaseInterface } from '@accounts/types';
import { AccountsOauth } from '../src';

const user: User = {
  id: '1',
  username: 'neo',
  email: 't1@matrix.com',
};
const mockStore: DatabaseInterface = {
  findUserByServiceId: jest.fn(() => user),
  findUserByEmail: jest.fn(),
  findUserByUsername: jest.fn(),
  findUserById: jest.fn(),
  findUserByEmailVerificationToken: jest.fn(),
  findSessionById: jest.fn(),
  createUser: jest.fn(),
  setUsername: jest.fn(),
  setProfile: jest.fn(),
  setService: jest.fn(),
  findPasswordHash: jest.fn(),
  findUserByResetPasswordToken: jest.fn(),
  setPassword: jest.fn(),
  addResetPasswordToken: jest.fn(),
  setResetPassword: jest.fn(),
  addEmail: jest.fn(),
  removeEmail: jest.fn(),
  verifyEmail: jest.fn(),
  addEmailVerificationToken: jest.fn(),
  createSession: jest.fn(),
  updateSession: jest.fn(),
  invalidateSession: jest.fn(),
  invalidateAllSessions: jest.fn(),
};

describe('AccountsOauth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should throw when no configuration object provided', async () => {
      expect(()=>{ new AccountsOauth() }).toThrow();
    });
    it('should throw when no providers property', async () => {
      expect(()=>{ new AccountsOauth({}) }).toThrow();
    });

    it('should throw if the authenticate function is not available on the provider', async () => {
      const oauth = new AccountsOauth({
        providers: [{ name: 'facebook' }],
      })
      expect(oauth.useService({ provider: 'facebook', action: 'authenticate' },{},{})).rejects.toThrow();
    });

    it("should call provider's authenticate method in order to get the user itself", async () => {
      const authSpy = jest.fn(() => ({
        id: '312312',
        name: 'Mr. Anderson',
        email: 't1@matrix.com',
      }));
      const oauth = new AccountsOauth({
        providers: [{ name: 'facebook', authenticate: authSpy }],
      });
      oauth.setStore(mockStore);

      const params = { accessToken: 'test' };
      await oauth.useService({ provider: 'facebook', action: 'authenticate' },params,{})

      expect(authSpy).toBeCalledWith(params);
    });

    it('should find a user by service id or email', async () => {
      const authSpy = jest.fn(() => ({
        id: '312312',
        name: 'Mr. Anderson',
        email: 't1@matrix.com',
      }));
      const oauth = new AccountsOauth({
        providers: [{ name: 'facebook', authenticate: authSpy }],
      });
      const store = {
        ...mockStore,
        findUserByServiceId: jest.fn(),
        findUserByEmail: jest.fn(() => user),
      };
      oauth.setStore(store);

      const params = {
        accessToken: 'test',
      };
      await oauth.useService({ provider: 'facebook', action: 'authenticate' },params,{})

      expect(authSpy).toBeCalledWith(params);
      expect(store.findUserByServiceId).toBeCalledWith('facebook', '312312');
      expect(store.findUserByEmail).toBeCalledWith('t1@matrix.com');
    });

    it('should create a user if not found on the accounts db', async () => {
      const user2 = {
        id: '2',
        name: 'Ms. Anderson',
        email: 't2@matrix.com',
      };
      const authSpy = jest.fn(() => user2);
      const oauth = new AccountsOauth({
        providers: [{ name: 'facebook', authenticate: authSpy }],
      });
      const store = {
        ...mockStore,
        findUserByServiceId: jest.fn(),
        findUserByEmail: jest.fn(),
        createUser: jest.fn(() => '34123'),
        findUserById: jest.fn(() => ({
          id: '34123',
          email: user2.email,
        })),
      };
      oauth.setStore(store);

      const params = {
        accessToken: 'test',
      };
      await oauth.useService({ provider: 'facebook', action: 'authenticate' },params,{});

      expect(authSpy).toBeCalledWith(params);
      expect(store.findUserByServiceId).toBeCalledWith('facebook', '2');
      expect(store.findUserByEmail).toBeCalledWith('t2@matrix.com');
      expect(store.createUser).toBeCalledWith({ email: user2.email });
      expect(store.findUserById).toBeCalledWith('34123');
      expect(store.setService).toBeCalledWith('34123', 'facebook', user2);
    });
  });

  it("should update the user's profile if logged in after change in profile", async () => {
    const userChanged = {
      id: '312312',
      name: 'Mr. Anderson',
      email: 't1@matrix.com',
      profile: {
        gender: 'other',
      },
    };
    const authSpy = jest.fn(() => userChanged);
    const oauth = new AccountsOauth({
      providers: [{ name: 'facebook', authenticate: authSpy }],
    });
    oauth.setStore(mockStore);

    const params = {
      accessToken: 'test',
    };
    await oauth.useService({ provider: 'facebook', action: 'authenticate' },params,{});

    expect(authSpy).toBeCalledWith(params);
    expect(mockStore.findUserByServiceId).toBeCalledWith('facebook', '312312');
    expect(mockStore.setProfile).toBeCalledWith(user.id, userChanged.profile);
    expect(mockStore.setService).toBeCalledWith(user.id, 'facebook', userChanged);
  });
});

describe('unlink', () => {
  const oauth = new AccountsOauth({
    providers: [{ name: 'facebook' }],
  });
  oauth.setStore(mockStore);

  it('should throw if given wrong provider', async () => {
    try {
      await oauth.unlink({name:'twitter'}, { userId: '1' });
    } catch (e) {
      expect(e.message).toBe('Invalid provider');
    }
  });

  it('should unset data of oauth provider', async () => {
    await oauth.unlink({name:'facebook'}, { userId: '1' });
    expect(mockStore.setService).toBeCalledWith('1', 'facebook', null);
  });
});
