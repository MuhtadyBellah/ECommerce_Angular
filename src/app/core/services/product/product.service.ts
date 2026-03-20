import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse, Paged } from '../../models/default.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = inject(ApiService);

  getAllProducts(params?: any): Observable<Paged<DefaultResponse>> {
    return this.api.get<Paged<DefaultResponse>>('products', {
      page: 1,
      limit: 10,
      keyword: '',
      feilds: '',
      // price[gte]: 0,
      // price[let]: 0,
      brand: '',
      // categoy[in]: '',
      // categoy[in]: '',
      ...params,
    });
  }

  getProduct(productId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`products/${productId}`, params);
  }
}
