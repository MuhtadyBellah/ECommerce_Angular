import { Root } from './root.interface';

export interface Brand extends Root {
  data: BrandData[];
}

export interface BrandResponse extends Root {
  data: BrandData[];
}

export interface BrandData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
