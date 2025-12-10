import type { PublicUser } from '../types';

export interface TokenService {
  signAccessToken(user: PublicUser): Promise<string>;
  signRefreshToken(user: PublicUser): Promise<string>;
}
