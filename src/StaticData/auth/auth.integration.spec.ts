import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe.skip('Auth Integration Tests (Prisma)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should connect to database', async () => {
    const users = await prisma.user.findMany();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
  });

  it('should create user in database', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'integration@test.com',
        password: 'hashed',
        username: 'integration',
      },
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('integration@test.com');
    expect(user.username).toBe('integration');
  });
});
