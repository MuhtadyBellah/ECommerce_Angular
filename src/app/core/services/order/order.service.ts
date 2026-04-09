import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { orderRequest } from '../../models/request.interface';
import { Root } from '../../models/root.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly api = inject(ApiService);

  postOrder(cartId: string, data: orderRequest): Observable<Root> {
    return this.api.post<Root>(`orders/${cartId}`, data);
  }

  getAllOrders(params?: any): Observable<Root> {
    return this.api.get<Root>('orders', params);
  }

  getUserOrders(userId: string, params?: any): Observable<Root> {
    return this.api.get<Root>(`orders/user/${userId}`, params);
  }

  postCheckout(orderId: string, data: orderRequest): Observable<Root> {
    return this.api.post<Root>(`orders/checkout-session/${orderId}`, data, {
      url: 'http://localhost:3000',
    });
  }
}
