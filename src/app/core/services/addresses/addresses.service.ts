import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../models/default.interface';
import { addressRequest } from '../../models/request.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private readonly api = inject(ApiService);

  addAddress(data: addressRequest): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>('addresses', data);
  }

  deleteAddress(addressId: string): Observable<DefaultResponse> {
    return this.api.delete<DefaultResponse>(`addresses/${addressId}`);
  }

  getAddress(addressId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`addresses/${addressId}`, params);
  }

  getUserWishlist(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`addresses`, params);
  }
}
