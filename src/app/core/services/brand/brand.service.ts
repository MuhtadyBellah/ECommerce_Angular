import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../../models/brand.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly api = inject(ApiService);

  getAllBrands(params?: any): Observable<Brand> {
    return this.api.get<Brand>('brands', {
      page: 1,
      limit: 10,
      keyword: '',
      ...params,
    });
  }

  getBrand(brandId: string, params?: any): Observable<Brand> {
    return this.api.get<Brand>(`brands/${brandId}`, params);
  }
}
