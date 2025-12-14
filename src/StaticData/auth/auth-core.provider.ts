import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

import { AuthCore } from 'auth-lib';
import { PrismaUserRepository } from './adapters/prisma-user.repository';
import { BcryptPasswordHasher } from './adapters/bcrypt.password-hasher';
import { JwtTokenService } from './adapters/jwt.token-service';

import type { JwtSignOptions } from '@nestjs/jwt';

type ExpiresIn = JwtSignOptions['expiresIn'];

function parseExpiresIn(
  value: string | undefined,
  fallback: ExpiresIn,
): ExpiresIn {
  if (!value) return fallback;

  const v = value.trim();

  if (/^\d+(ms|s|m|h|d|w|y)$/i.test(v)) return v as ExpiresIn;

  if (/^\d+$/.test(v)) return Number(v);

  return fallback;
}

export const AUTH_CORE = Symbol('AUTH_CORE');

export const AuthCoreProvider = {
  provide: AUTH_CORE,
  inject: [PrismaService, JwtService],
  useFactory: (prisma: PrismaService, jwt: JwtService) => {
    const rounds = Number(process.env.BCRYPT_ROUNDS ?? 10);
    const accessTtl = parseExpiresIn(process.env.JWT_ACCESS_TTL, '15m');
    const refreshTtl = parseExpiresIn(process.env.JWT_REFRESH_TTL, '30d');

    return new AuthCore({
      userRepo: new PrismaUserRepository(prisma),
      hasher: new BcryptPasswordHasher(rounds),
      tokens: new JwtTokenService(jwt, accessTtl, refreshTtl),
    });
  },
};
