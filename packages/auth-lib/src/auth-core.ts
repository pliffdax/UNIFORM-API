import type { UserRepository } from './ports/user-repository';
import type { PasswordHasher } from './ports/password-hasher';
import type { TokenService } from './ports/token-service';
import type {
  AuthResult,
  LoginInput,
  RegisterInput,
  PublicUser,
} from './types';
import { InvalidCredentialsError, UserAlreadyExistsError } from './errors';

export type AuthCoreDeps = {
  userRepo: UserRepository;
  hasher: PasswordHasher;
  tokens: TokenService;
};

export class AuthCore {
  constructor(private readonly deps: AuthCoreDeps) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim();

    const [byEmail, byUsername] = await Promise.all([
      this.deps.userRepo.findByEmail(email),
      this.deps.userRepo.findByUsername(username),
    ]);

    if (byEmail || byUsername) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await this.deps.hasher.hash(input.password);
    const created = await this.deps.userRepo.createUser({
      email,
      username,
      passwordHash,
      isStaff: Boolean(input.isStaff),
    });

    const user: PublicUser = {
      id: created.id,
      username: created.username,
      email: created.email,
      isStaff: created.isStaff,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.deps.tokens.signAccessToken(user),
      this.deps.tokens.signRefreshToken(user),
    ]);

    return { user, tokens: { accessToken, refreshToken } };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const key = input.emailOrUsername.trim();
    const looksLikeEmail = key.includes('@');

    const userRecord = looksLikeEmail
      ? await this.deps.userRepo.findByEmail(key.toLowerCase())
      : await this.deps.userRepo.findByUsername(key);

    if (!userRecord) {
      throw new InvalidCredentialsError();
    }

    const ok = await this.deps.hasher.compare(
      input.password,
      userRecord.passwordHash,
    );
    if (!ok) {
      throw new InvalidCredentialsError();
    }

    const user: PublicUser = {
      id: userRecord.id,
      username: userRecord.username,
      email: userRecord.email,
      isStaff: userRecord.isStaff,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.deps.tokens.signAccessToken(user),
      this.deps.tokens.signRefreshToken(user),
    ]);

    return { user, tokens: { accessToken, refreshToken } };
  }
}
