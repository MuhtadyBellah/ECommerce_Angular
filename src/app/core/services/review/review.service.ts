import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../models/default.interface';
import { reviewRequest } from '../../models/request.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly api = inject(ApiService);

  addReview(productId: string, data: reviewRequest): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>(`products/${productId}/reviews`, data);
  }

  getReviewsProduct(productId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`products/${productId}/reviews`, params);
  }

  getAllReviews(params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>('reviews', params);
  }

  getReview(reviewId: string, params?: any): Observable<DefaultResponse> {
    return this.api.get<DefaultResponse>(`reviews/${reviewId}`, params);
  }

  updateReview(reviewId: string, data: reviewRequest): Observable<DefaultResponse> {
    return this.api.put<DefaultResponse>(`reviews/${reviewId}`, data);
  }

  deleteReview(reviewId: string): Observable<DefaultResponse> {
    return this.api.delete<DefaultResponse>(`reviews/${reviewId}`);
  }
}
