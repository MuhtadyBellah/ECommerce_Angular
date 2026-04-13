import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubCategory, SubCategoryResponse } from '../../models/sub-category.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private readonly api = inject(ApiService);

  getAllSubCategories(params?: any): Observable<SubCategory> {
    return this.api.get<SubCategory>('subcategories', { limit: 10, ...params });
  }

  getSubCategory(subcategoryId: string, params?: any): Observable<SubCategoryResponse> {
    return this.api.get<SubCategoryResponse>(`subcategories/${subcategoryId}`, params);
  }

  getSubCategoriesMainCategory(categoryId: string, params?: any): Observable<SubCategory> {
    return this.api.get<SubCategory>(`categories/${categoryId}/subcategories`, params);
  }
}
