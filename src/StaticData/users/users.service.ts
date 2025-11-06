import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: 'id' },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    await this.findOne(id); // Ensure the user exists
    return this.prisma.user.update({
      where: { id: 'id' },
      data,
    });
  }

  async remove(id: number): Promise<User> {
    await this.findOne(id); // Ensure the user exists
    return this.prisma.user.delete({
      where: { id: 'id' },
    });
  }
}
