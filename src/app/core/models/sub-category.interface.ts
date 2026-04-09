import { Root } from './root.interface';

export interface SubCategory extends Root {
  data: SubCategoryData | SubCategoryData[];
}

export interface SubCategoryData {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
