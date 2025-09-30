import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateFacultyDto,
  UpdateFacultyDto,
  Faculty,
} from './faculties.interface';

@Injectable()
export class FacultiesService {
  private faculties: Faculty[] = [];
  private nextId = 1;

  findAll(query?: any): Faculty[] {
    let result = this.faculties;

    if (query?.name) {
      result = result.filter((faculty) =>
        faculty.name.toLowerCase().includes(query.name.toLowerCase()),
      );
    }

    if (query?.code) {
      result = result.filter((faculty) =>
        faculty.code.toLowerCase().includes(query.code.toLowerCase()),
      );
    }

    return result;
  }

  findOne(id: number): Faculty {
    const faculty = this.faculties.find((faculty) => faculty.id === id);
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }
    return faculty;
  }

  create(createFacultyDto: CreateFacultyDto): Faculty {
    const faculty: Faculty = {
      id: this.nextId++,
      ...createFacultyDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.faculties.push(faculty);
    return faculty;
  }

  update(id: number, updateFacultyDto: UpdateFacultyDto): Faculty {
    const facultyIndex = this.faculties.findIndex(
      (faculty) => faculty.id === id,
    );
    if (facultyIndex === -1) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    const updatedFaculty = {
      ...this.faculties[facultyIndex],
      ...updateFacultyDto,
      updatedAt: new Date(),
    };

    this.faculties[facultyIndex] = updatedFaculty;
    return updatedFaculty;
  }

  remove(id: number): Faculty {
    const facultyIndex = this.faculties.findIndex(
      (faculty) => faculty.id === id,
    );
    if (facultyIndex === -1) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    const removedFaculty = this.faculties[facultyIndex];
    this.faculties.splice(facultyIndex, 1);
    return removedFaculty;
  }
}
