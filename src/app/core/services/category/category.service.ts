import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse, Paged } from '../../models/default.interface';
import { ApiService } from '../api.service';
import { CategoryResponse } from './../../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly api = inject(ApiService);

  getAllCategories(params?: any): Observable<Paged<CategoryResponse>> {
    return this.api.get<Paged<CategoryResponse>>('categories', {
      page: 1,
      limit: 10,
      ...params,
    });
  }

  getCategory(categoryId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`categories/${categoryId}`, params);
  }
}
