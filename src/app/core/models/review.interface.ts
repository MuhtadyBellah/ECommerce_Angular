import { User } from './auth.interface';
import { Root } from './root.interface';

export interface Review extends Root {
  data: reviewData[];
}

export interface reviewData {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
