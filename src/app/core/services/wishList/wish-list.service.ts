import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Root } from '../../models/root.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private readonly api = inject(ApiService);

  addProduct(productId: string): Observable<Root> {
    return this.api.post<Root>('wishlist', {
      productId,
    });
  }

  deleteProduct(productId: string): Observable<Root> {
    return this.api.delete<Root>(`wishlist/${productId}`);
  }

  getUserWishlist(params?: any): Observable<Root> {
    return this.api.get<Root>(`wishlist`, params);
  }
}
