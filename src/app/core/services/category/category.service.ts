import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Category, CategoryResponse } from './../../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly api = inject(ApiService);

  getAllCategories(params?: any): Observable<Category> {
    return this.api.get<Category>('categories', {
      page: 1,
      limit: 10,
      ...params,
    });
  }

  getCategory(categoryId: string, params?: any): Observable<CategoryResponse> {
    return this.api.get<CategoryResponse>(`categories/${categoryId}`, params);
  }
}
