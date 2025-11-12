import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';

function toSlug(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '-');
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    const payload = {
      ...data,
      slug: data.slug ?? toSlug(data.name),
    };
    return this.prisma.category.create({ data: payload });
  }

  async update(
    id: number,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    await this.findOne(id);
    const payload: Prisma.CategoryUpdateInput = {
      ...data,
      ...(data.name && !data.slug ? { slug: toSlug(String(data.name)) } : {}),
    };
    return this.prisma.category.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: number): Promise<Category> {
    await this.findOne(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
