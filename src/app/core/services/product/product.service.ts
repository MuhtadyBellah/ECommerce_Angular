import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../../models/product.interface';
import { productParams } from '../../models/request.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = inject(ApiService);

  getAllProducts(params?: productParams): Observable<Product> {
    return this.api.get<Product>('products', {
      page: 1,
      limit: 10,
      ...params,
    });
  }

  getProduct(productId: string, params?: any): Observable<ProductResponse> {
    return this.api.get<ProductResponse>(`products/${productId}`, params);
  }
}
