import { Root } from './root.interface';

export interface Category extends Root {
  data: CategoryData | CategoryData[];
}

export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
