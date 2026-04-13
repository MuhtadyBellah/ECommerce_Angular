import { Root } from './root.interface';

export interface SubCategory extends Root {
  data: SubCategoryData[];
}

export interface SubCategoryResponse extends Root {
  data: SubCategoryData;
}

export interface SubCategoryData {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
