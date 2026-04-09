import { Root } from './root.interface';

export interface Auth extends Root {
  totalUsers: number;
  users: User[];
  user: User;
  token: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}
