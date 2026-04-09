import { Root } from './root.interface';

export interface Address extends Root {
  data: AddressData | AddressData[];
}

export interface AddressData {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}
