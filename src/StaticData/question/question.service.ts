import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Question, Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Question[]> {
    return this.prisma.question.findMany();
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.prisma.question.findUnique({
      where: { id: id },
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async create(data: Prisma.QuestionCreateInput): Promise<Question> {
    return this.prisma.question.create({
      data: {
        ...rest,
        user: {
          connect: { id: userid },
        },
      },
    });
  }

  async update(
    id: number,
    data: Prisma.QuestionUpdateInput,
  ): Promise<Question> {
    await this.findOne(id);
    return this.prisma.question.update({
      where: { id: id },
      data,
    });
  }

  async remove(id: number): Promise<Question> {
    await this.findOne(id);
    return this.prisma.question.delete({
      where: { id: id },
    });
  }
}
