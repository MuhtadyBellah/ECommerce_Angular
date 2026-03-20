import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse, Paged } from '../../models/default.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly api = inject(ApiService);

  getAllBrands(params?: any): Observable<Paged<DefaultResponse>> {
    return this.api.get<Paged<DefaultResponse>>('brands', {
      page: 1,
      limit: 10,
      keyword: '',
      ...params,
    });
  }

  getBrand(brandId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`brands/${brandId}`, params);
  }
}
