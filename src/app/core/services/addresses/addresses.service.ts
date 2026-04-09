import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../../models/address.interface';
import { addressRequest } from '../../models/request.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private readonly api = inject(ApiService);

  addAddress(data: addressRequest): Observable<Address> {
    return this.api.post<Address>('addresses', data);
  }

  deleteAddress(addressId: string): Observable<Address> {
    return this.api.delete<Address>(`addresses/${addressId}`);
  }

  getAddress(addressId: string, params?: any): Observable<Address> {
    return this.api.get<Address>(`addresses/${addressId}`, params);
  }

  getUserWishlist(params?: any): Observable<Address> {
    return this.api.get<Address>(`addresses`, params);
  }
}
