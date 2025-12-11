import {
  AuthCore,
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from 'auth-lib';
import type {
  UserRepository,
  UserRecord,
  PasswordHasher,
  TokenService,
} from 'auth-lib';

describe('auth-lib AuthCore', () => {
  const makeDeps = () => {
    const userRepo: jest.Mocked<UserRepository> = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      createUser: jest.fn(),
    };

    const hasher: jest.Mocked<PasswordHasher> = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    const tokens: jest.Mocked<TokenService> = {
      signAccessToken: jest.fn(),
      signRefreshToken: jest.fn(),
    };

    const core = new AuthCore({ userRepo, hasher, tokens });
    return { core, userRepo, hasher, tokens };
  };

  test('register: success', async () => {
    const { core, userRepo, hasher, tokens } = makeDeps();

    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.findByUsername.mockResolvedValue(null);
    hasher.hash.mockResolvedValue('hashed');
    userRepo.createUser.mockResolvedValue({
      id: 'u1',
      username: 'john',
      email: 'john@mail.com',
      passwordHash: 'hashed',
      isStaff: false,
    } satisfies UserRecord);

    tokens.signAccessToken.mockResolvedValue('access');
    tokens.signRefreshToken.mockResolvedValue('refresh');

    const res = await core.register({
      username: 'john',
      email: 'john@mail.com',
      password: '123456',
      isStaff: false,
    });

    expect(res.user.email).toBe('john@mail.com');
    expect(res.tokens.accessToken).toBe('access');
    expect(tokens.signAccessToken.mock.calls).toHaveLength(1);
  });

  test('register: conflict if email exists', async () => {
    const { core, userRepo } = makeDeps();

    userRepo.findByEmail.mockResolvedValue({
      id: 'u1',
      username: 'john',
      email: 'john@mail.com',
      passwordHash: 'hashed',
      isStaff: false,
    });

    await expect(
      core.register({
        username: 'new',
        email: 'john@mail.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  test('login: invalid if user not found', async () => {
    const { core, userRepo } = makeDeps();
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      core.login({ emailOrUsername: 'x@mail.com', password: '123' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test('login: success', async () => {
    const { core, userRepo, hasher, tokens } = makeDeps();

    userRepo.findByEmail.mockResolvedValue({
      id: 'u1',
      username: 'john',
      email: 'john@mail.com',
      passwordHash: 'hashed',
      isStaff: false,
    });

    hasher.compare.mockResolvedValue(true);
    tokens.signAccessToken.mockResolvedValue('access');
    tokens.signRefreshToken.mockResolvedValue('refresh');

    const res = await core.login({
      emailOrUsername: 'john@mail.com',
      password: '123',
    });

    expect(res.user.id).toBe('u1');
    expect(res.tokens.refreshToken).toBe('refresh');
  });
});
