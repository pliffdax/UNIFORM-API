export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
}
