import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  async createUser(@Body() user: Prisma.UserCreateInput): Promise<User> {
    return this.usersService.create(user);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(Number(id), user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(Number(id));
  }
}
