import { DefaultResponse } from './default.interface';
export interface Auth extends DefaultResponse {
  totalUsers: number;
  users: UserData[];
}

export interface AuthResponse extends DefaultResponse {
  token: string;
  user: UserData;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;

  photo: string;
  dateOfBirth: string;
  gender: string;
  passwordChangedAt: string;
}
