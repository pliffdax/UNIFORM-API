// @ts-nocheck
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({ data });
  }

  async update(id: number, data: Prisma.RoleUpdateInput): Promise<Role> {
    await this.findOne(id);
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Role> {
    await this.findOne(id);
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
