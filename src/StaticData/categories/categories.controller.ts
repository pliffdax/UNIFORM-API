import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Prisma, Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categories.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categories.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categories.create(dto as Prisma.CategoryCreateInput);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categories.update(id, dto as Prisma.CategoryUpdateInput);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categories.remove(id);
  }
}
