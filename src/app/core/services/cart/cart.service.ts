import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../models/default.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly api = inject(ApiService);

  addProduct(productId: string): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>('cart', {
      productId,
    });
  }

  updateProduct(productId: string, cout: string): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`cart/${productId}`, {
      cout,
    });
  }

  deleteProduct(productId: string): Observable<DefaultResponse> {
    return this.api.delete<DefaultResponse>(`cart/${productId}`);
  }

  getUserCart(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`cart`, params);
  }

  clearUserCart(): Observable<DefaultResponse> {
    return this.api.delete<DefaultResponse>(`cart`);
  }
}
