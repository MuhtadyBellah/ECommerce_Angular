import { Root } from './root.interface';

export interface Address extends Root {
  data: AddressData[];
}

export interface AddressResponse extends Root {
  data: AddressData;
}

export interface AddressData {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}
