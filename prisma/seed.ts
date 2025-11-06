import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpass123',
      isStaff: true,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: '',
          role: 1,
          group: 'IO-35',
          faculty: 10,
          questions: 0,
          answers: 0,
          avatarUrl: null,
          status: 'active',
        },
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      username: 'student1',
      email: 'student@example.com',
      password: 'hashed_password_456',
      isStaff: false,
      profile: {
        create: {
          firstName: 'Alex',
          lastName: 'Ivanov',
          role: 2,
          group: 'CS-21',
          faculty: 12,
          questions: 5,
          answers: 2,
          avatarUrl: 'https://example.com/avatar.png',
          status: 'offline',
        },
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
