import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse, Paged } from '../../models/default.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly api = inject(ApiService);

  getAllCategories(params?: any): Observable<Paged<DefaultResponse>> {
    return this.api.get<Paged<DefaultResponse>>('categories', {
      page: 1,
      limit: 10,
      keyword: '',
      ...params,
    });
  }

  getCategory(categoryId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`categories/${categoryId}`, params);
  }
}
