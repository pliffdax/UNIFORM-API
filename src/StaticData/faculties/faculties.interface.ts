export interface Faculty {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFacultyDto {
  name: string;
}

export interface UpdateFacultyDto {
  name?: string;
}
