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
  cover: string;
  dateOfBirth: string;
  gender: string;
  bookmarks: [];
  followers: [];
  following: [];
  passwordChangedAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  mutualFollowersCount: number;
}

export interface registerRequest {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface loginRequest {
  email: string;
  password: string;
}

export interface changPasswordRequest {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface resetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface updateProfileRequest {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}
