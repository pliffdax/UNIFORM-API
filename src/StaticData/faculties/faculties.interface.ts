export interface Faculty {
  id: number;
  name: string;
  code: string;
  description?: string;
  dean?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFacultyDto {
  name: string;
  code: string;
  description?: string;
  dean?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

export interface UpdateFacultyDto {
  name?: string;
  code?: string;
  description?: string;
  dean?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}
