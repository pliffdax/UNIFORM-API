import type { UserRepository, UserRecord } from 'auth-lib';
import type { PrismaService } from '../../../prisma/prisma.service';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserRecord | null> {
    const u = await this.prisma.user.findUnique({ where: { email } });
    if (!u) return null;

    return {
      id: u.id,
      username: u.username,
      email: u.email,
      passwordHash: u.password,
      isStaff: u.isStaff,
    };
  }

  async findByUsername(username: string): Promise<UserRecord | null> {
    const u = await this.prisma.user.findUnique({ where: { username } });
    if (!u) return null;

    return {
      id: u.id,
      username: u.username,
      email: u.email,
      passwordHash: u.password,
      isStaff: u.isStaff,
    };
  }

  async createUser(data: {
    username: string;
    email: string;
    passwordHash: string;
    isStaff: boolean;
  }): Promise<UserRecord> {
    const u = await this.prisma.user.create({
      data: {
        username: data.username || '',
        email: data.email,
        password: data.passwordHash,
        isStaff: data.isStaff,
      },
    });

    return {
      id: u.id,
      username: u.username,
      email: u.email,
      passwordHash: u.password,
      isStaff: u.isStaff,
    };
  }
}
