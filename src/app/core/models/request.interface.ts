export interface Request {}

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

export interface addressRequest {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface reviewRequest {
  review: string;
  rating: number;
}

export interface orderRequest {
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
}

export interface productParams {
  page: number;
  limit: number;
  q?: string;
  category?: string[];
  subcategory?: string[];
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}
