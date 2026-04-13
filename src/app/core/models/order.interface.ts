import { AddressData } from './address.interface';
import { User } from './auth.interface';
import { CartData } from './cart.interface';
import { Root } from './root.interface';

export interface Order extends Root {
  session: Session;
  data: OrderData[];
}

export interface OrderData {
  shippingAddress?: AddressData;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: User;
  cartItems: CartData[];
  createdAt: string;
  updatedAt: string;
  id: number;
  paidAt?: string;
}

export interface Session {
  url: string;
  success_url: string;
  cancel_url: string;
}
