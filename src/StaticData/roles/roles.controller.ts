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
import { RolesService } from './roles.service';
import { Prisma, Role } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roles: RolesService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.roles.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.roles.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.roles.create(dto as Prisma.RoleCreateInput);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roles.update(id, dto as Prisma.RoleUpdateInput);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.roles.remove(id);
  }
}
