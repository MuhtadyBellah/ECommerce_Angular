import { ProductData } from './product.interface';
import { Root } from './root.interface';

export interface Cart extends Root {
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
  _v: number;
  totalCartPrice: number;
}

export interface Product {
  count: number;
  _id: string;
  product: ProductData;
  price: number;
}
