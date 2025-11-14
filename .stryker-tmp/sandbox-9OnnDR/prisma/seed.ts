// @ts-nocheck
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database (CJS)...');

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'System administrator' },
  });
  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER', description: 'Regular student account' },
  });

  const faculty = await prisma.faculty.upsert({
    where: { name: 'Computer Science' },
    update: {},
    create: { name: 'Computer Science' },
  });

  const catGeneral = await prisma.category.upsert({
    where: { slug: 'general' },
    update: {},
    create: { name: 'General', slug: 'general' },
  });
  const catProgramming = await prisma.category.upsert({
    where: { slug: 'programming' },
    update: {},
    create: { name: 'Programming', slug: 'programming' },
  });

  const admin = await prisma.user.upsert({
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
          lastName: 'Root',
          role: adminRole.id,
          group: 'IO-35',
          facultyId: faculty.id,
          questions: 1,
          answers: 1,
          status: 'active',
        },
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      username: 'student1',
      email: 'student@example.com',
      password: 'studentpass123',
      isStaff: false,
      profile: {
        create: {
          firstName: 'Alex',
          lastName: 'Ivanov',
          role: userRole.id,
          group: 'CS-21',
          facultyId: faculty.id,
          questions: 1,
          answers: 1,
          avatarUrl: 'https://example.com/avatar.png',
          status: 'offline',
        },
      },
    },
  });

  const q1 = await prisma.question.create({
    data: {
      questionName: 'How to use Prisma with NestJS?',
      questionText: 'How to inject PrismaService properly?',
      category: catProgramming.name,
      status: 'open',
      userId: student.id,
    },
  });

  const q2 = await prisma.question.create({
    data: {
      questionName: 'What is a Faculty entity?',
      questionText: 'How to connect user profile with faculty in Prisma?',
      category: catGeneral.name,
      status: 'open',
      userId: admin.id,
    },
  });

  // 6) Ответы
  await prisma.answer.create({
    data: {
      answerText: 'Provide PrismaService as a provider and inject it.',
      category: catProgramming.name,
      questionId: q1.id,
      userId: admin.id,
      likes: 3,
      acceptedAnswer: true,
    },
  });

  await prisma.answer.create({
    data: {
      answerText: 'Faculty is a simple reference table; link by facultyId.',
      category: catGeneral.name,
      questionId: q2.id,
      userId: student.id,
      likes: 1,
    },
  });

  console.log('✅ Seed complete');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Seed error:', e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
