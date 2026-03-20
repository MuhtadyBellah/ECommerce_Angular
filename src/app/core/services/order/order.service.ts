import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../models/default.interface';
import { orderRequest } from '../../models/request.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly api = inject(ApiService);

  postOrder(cartId: string, data: orderRequest): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`orders/${cartId}`, data);
  }

  getAllOrders(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>('orders', params);
  }

  getUserOrders(userId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`orders/user/${userId}`, params);
  }

  postCheckout(orderId: string, data: orderRequest): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`orders/checkout-session/${orderId}`, data, {
      url: 'http://localhost:3000',
    });
  }
}
