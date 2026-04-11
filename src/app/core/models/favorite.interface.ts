import { ProductData } from './product.interface';
import { Root } from './root.interface';

export interface Favorite extends Root {
  count: number;
  data: ProductData[];
}
