import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Root } from '../../models/root.interface';
import { ApiService } from '../api.service';
import { Cart } from './../../models/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly api = inject(ApiService);

  addProduct(productId: string): Observable<Cart> {
    return this.api.post<Cart>('cart', {
      productId,
    });
  }

  updateProduct(productId: string, count: number): Observable<Root> {
    return this.api.put<Root>(`cart/${productId}`, {
      count,
    });
  }

  deleteProduct(productId: string): Observable<Root> {
    return this.api.delete<Root>(`cart/${productId}`);
  }

  getUserCart(params?: any): Observable<Cart> {
    return this.api.get<Cart>(`cart`, params);
  }

  clearUserCart(): Observable<Root> {
    return this.api.delete<Root>(`cart`);
  }
}
