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
import { User } from './users.interface.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number): User {
    return this.usersService.findOne(id);
  }

  @Post()
  createUser(@Body() user: User): User {
    return this.usersService.create(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: Partial<User>): User {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): void {
    this.usersService.delete(id);
  }
}
