import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.interface.js';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      username: 'alice',
      email: 'alice@gmail.com',
      password: 'alice123',
      is_staff: false,
      created_at: '2023-10-01T10:00:00Z',
      updated_at: '2023-10-01T10:00:00Z',
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(user: User): User {
    user.id = this.users.length + 1;
    user.created_at = new Date().toISOString();
    user.updated_at = new Date().toISOString();
    this.users.push(user);
    return user;
  }

  update(id: number, updatedUser: Partial<User>): User {
    const user = this.findOne(id);
    Object.assign(user, updatedUser);
    user.updated_at = new Date().toISOString();
    return user;
  }

  delete(id: number): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
