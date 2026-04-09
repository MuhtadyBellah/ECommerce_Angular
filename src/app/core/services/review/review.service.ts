import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { reviewRequest } from '../../models/request.interface';
import { Root } from '../../models/root.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly api = inject(ApiService);

  addReview(productId: string, data: reviewRequest): Observable<Root> {
    return this.api.post<Root>(`products/${productId}/reviews`, data);
  }

  getReviewsProduct(productId: string, params?: any): Observable<Root> {
    return this.api.get<Root>(`products/${productId}/reviews`, params);
  }

  getAllReviews(params?: any): Observable<Root> {
    return this.api.get<Root>('reviews', params);
  }

  getReview(reviewId: string, params?: any): Observable<Root> {
    return this.api.get<Root>(`reviews/${reviewId}`, params);
  }

  updateReview(reviewId: string, data: reviewRequest): Observable<Root> {
    return this.api.put<Root>(`reviews/${reviewId}`, data);
  }

  deleteReview(reviewId: string): Observable<Root> {
    return this.api.delete<Root>(`reviews/${reviewId}`);
  }
}
