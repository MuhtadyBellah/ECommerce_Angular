import { DefaultResponse } from './default.interface';

export interface Category {}

export interface CategoryResponse extends DefaultResponse {
  data: CategoryData[];
}

export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
