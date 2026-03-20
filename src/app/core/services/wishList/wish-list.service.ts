import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../models/default.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private readonly api = inject(ApiService);

  addProduct(productId: string): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>('wishlist', {
      productId,
    });
  }

  deleteProduct(productId: string): Observable<DefaultResponse> {
    return this.api.delete<DefaultResponse>(`wishlist/${productId}`);
  }

  getUserWishlist(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`wishlist`, params);
  }
}
