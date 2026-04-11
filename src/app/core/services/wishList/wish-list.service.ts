import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../../models/favorite.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private readonly api = inject(ApiService);

  addProduct(productId: string): Observable<Favorite> {
    return this.api.post<Favorite>('wishlist', {
      productId,
    });
  }

  deleteProduct(productId: string): Observable<Favorite> {
    return this.api.delete<Favorite>(`wishlist/${productId}`);
  }

  getUserWishlist(params?: any): Observable<Favorite> {
    return this.api.get<Favorite>(`wishlist`, params);
  }
}
