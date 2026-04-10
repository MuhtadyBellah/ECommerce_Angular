import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.interface';
import { orderRequest } from '../../models/request.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly api = inject(ApiService);

  postOrder(cartId: string, data: orderRequest): Observable<Order> {
    return this.api.post<Order>(`orders/${cartId}`, data);
  }

  getAllOrders(params?: any): Observable<Order> {
    return this.api.get<Order>('orders', params);
  }

  getUserOrders(userId: string, params?: any): Observable<Order> {
    return this.api.get<Order>(`orders/user/${userId}`, params);
  }

  postVisaOrder(cartId: string, data: orderRequest): Observable<Order> {
    return this.api.post<Order>(`orders/checkout-session/${cartId}`, data, {
      url: 'http://localhost:3000',
    });
  }
}
