import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';  // Змінено шлях
import { CreateFacultyDto, UpdateFacultyDto } from './faculties.interface';
import {Prisma, Faculty } from '@prisma/client';

@Injectable()
export class FacultiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.faculty.findMany();
  }

  async findOne(id: number) {
    return this.prisma.faculty.findUnique({
      where: { id }
    });
  }

  async create(createFacultyDto: CreateFacultyDto) {
    return this.prisma.faculty.create({
      data: createFacultyDto
    });
  }

  async update(id: number, updateFacultyDto: UpdateFacultyDto) {
    return this.prisma.faculty.update({
      where: { id },
      data: updateFacultyDto
    });
  }

  async remove(id: number) {
    return this.prisma.faculty.delete({
      where: { id }
    });
  }
}
