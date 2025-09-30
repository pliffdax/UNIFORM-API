import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, CreateRoleDto, UpdateRoleDto } from './roles.interface';

@Injectable()
export class RolesService {
  private roles: Role[] = [
    {
      id: 1,
      name: 'admin',
      description: 'Full access to system',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'moderator',
      description: 'Moderation tools',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'student',
      description: 'Default role for users',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  private nextId = this.roles.length + 1;

  findAll(): Role[] {
    return this.roles;
  }

  findOne(id: number): Role {
    const r = this.roles.find((x) => x.id === id);
    if (!r) throw new NotFoundException(`Role ${id} not found`);
    return r;
  }

  create(dto: CreateRoleDto): Role {
    const now = new Date().toISOString();
    const role: Role = {
      id: this.nextId++,
      name: dto.name,
      description: dto.description,
      created_at: now,
      updated_at: now,
    };
    this.roles.push(role);
    return role;
  }

  update(id: number, dto: UpdateRoleDto): Role {
    const role = this.findOne(id);
    if (dto.name !== undefined) role.name = dto.name;
    if (dto.description !== undefined) role.description = dto.description;
    role.updated_at = new Date().toISOString();
    return role;
  }

  remove(id: number): void {
    const i = this.roles.findIndex((x) => x.id === id);
    if (i === -1) throw new NotFoundException(`Role ${id} not found`);
    this.roles.splice(i, 1);
  }
}
