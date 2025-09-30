import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './categories.interface';

function toSlug(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    {
      id: 1,
      name: 'Programming',
      slug: 'programming',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Math',
      slug: 'math',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Electronics',
      slug: 'electronics',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  private nextId = this.categories.length + 1;

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: number): Category {
    const c = this.categories.find((x) => x.id === id);
    if (!c) throw new NotFoundException(`Category ${id} not found`);
    return c;
  }

  create(dto: CreateCategoryDto): Category {
    const now = new Date().toISOString();
    const cat: Category = {
      id: this.nextId++,
      name: dto.name,
      slug: dto.slug ?? toSlug(dto.name),
      created_at: now,
      updated_at: now,
    };
    this.categories.push(cat);
    return cat;
  }

  update(id: number, dto: UpdateCategoryDto): Category {
    const cat = this.findOne(id);
    if (dto.name !== undefined) {
      cat.name = dto.name;
      if (!dto.slug) cat.slug = toSlug(dto.name);
    }
    if (dto.slug !== undefined) cat.slug = dto.slug;
    cat.updated_at = new Date().toISOString();
    return cat;
  }

  remove(id: number): void {
    const i = this.categories.findIndex((x) => x.id === id);
    if (i === -1) throw new NotFoundException(`Category ${id} not found`);
    this.categories.splice(i, 1);
  }
}
