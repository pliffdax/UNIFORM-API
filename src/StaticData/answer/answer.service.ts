import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Answer, Prisma } from '@prisma/client';

@Injectable()
export class AnswersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Answer[]> {
    return this.prisma.answer.findMany();
  }

  async findOne(id: number): Promise<Answer> {
    const answer = await this.prisma.answer.findUnique({
      where: { id: id },
    });
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    return answer;
  }

  async create(data: Prisma.AnswerCreateInput): Promise<Answer> {
    return this.prisma.answer.create({ data });
  }

  async update(id: number, data: Prisma.AnswerUpdateInput): Promise<Answer> {
    await this.findOne(id);
    return this.prisma.answer.update({
      where: { id: id },
      data,
    });
  }

  async remove(id: number): Promise<Answer> {
    await this.findOne(id);
    return this.prisma.answer.delete({
      where: { id: id },
    });
  }
}
