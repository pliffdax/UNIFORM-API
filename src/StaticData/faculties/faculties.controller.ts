import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { CreateFacultyDto, UpdateFacultyDto } from './faculties.interface';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get()
  findAll() {
    return this.facultiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultiesService.findOne(+id);
  }

  @Post()
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDto) {
    return this.facultiesService.update(+id, updateFacultyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facultiesService.remove(+id);
  }
}
