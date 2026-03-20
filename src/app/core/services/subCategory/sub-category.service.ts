import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse, Paged } from '../../models/default.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private readonly api = inject(ApiService);

  getAllSubCategories(params?: any): Observable<Paged<DefaultResponse>> {
    return this.api.get<Paged<DefaultResponse>>('subcategories', { limit: 10, ...params });
  }

  getSubCategory(subcategoryId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`subcategories/${subcategoryId}`, params);
  }

  getSubCategoriesMainCategory(
    categoryId: string,
    params?: any,
  ): Observable<Paged<DefaultResponse>> {
    return this.api.get<Paged<DefaultResponse>>(`categories/${categoryId}/subcategories`, params);
  }
}
