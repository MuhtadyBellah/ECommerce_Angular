import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = inject(ApiService);

  getAllProducts(params?: any): Observable<Product> {
    return this.api.get<Product>('products', {
      page: 1,
      limit: 10,
      // feilds: '',
      // price[gte]: 0,
      // price[let]: 0,
      // brand: '',
      // categoy[in]: ['<category-id>'],
      ...params,
    });
  }

  getProduct(productId: string, params?: any): Observable<Product> {
    return this.api.get<Product>(`products/${productId}`, params);
  }
}
