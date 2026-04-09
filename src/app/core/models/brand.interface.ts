import { Root } from './root.interface';

export interface Brand extends Root {
  data: BrandData | BrandData[];
}

export interface BrandData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
