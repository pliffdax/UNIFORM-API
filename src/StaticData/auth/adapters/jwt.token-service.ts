import type { TokenService, PublicUser } from 'auth-lib';
import type { JwtService, JwtSignOptions } from '@nestjs/jwt';

type ExpiresIn = JwtSignOptions['expiresIn'];

export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly accessTtl: ExpiresIn,
    private readonly refreshTtl: ExpiresIn,
  ) {}

  signAccessToken(user: PublicUser): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      isStaff: user.isStaff,
    };

    return this.jwt.signAsync(payload, { expiresIn: this.accessTtl });
  }

  signRefreshToken(user: PublicUser): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };

    return this.jwt.signAsync(payload, { expiresIn: this.refreshTtl });
  }
}
