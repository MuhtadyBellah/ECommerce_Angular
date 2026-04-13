import { BrandData } from './brand.interface';
import { CategoryData } from './category.interface';
import { Root } from './root.interface';
import { SubCategoryData } from './sub-category.interface';

export interface Product extends Root {
  data: ProductData[];
}

export interface ProductResponse extends Root {
  data: ProductData;
}

export interface ProductData {
  sold: number;
  images: string[];
  subcategory: SubCategoryData;
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: CategoryData;
  brand: BrandData;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  priceAfterDiscount?: number;
  availableColors?: any[];
  isFavorite?: boolean;
}
