import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { reviewRequest } from '../../models/request.interface';
import { Review, ReviewResponse } from '../../models/review.interface';
import { Root } from '../../models/root.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly api = inject(ApiService);

  addReview(productId: string, data: reviewRequest): Observable<ReviewResponse> {
    return this.api.post<ReviewResponse>(`products/${productId}/reviews`, data);
  }

  getReviewsProduct(productId: string, params?: any): Observable<Review> {
    return this.api.get<Review>(`products/${productId}/reviews`, params);
  }

  getAllReviews(params?: any): Observable<Review> {
    return this.api.get<Review>('reviews', params);
  }

  getReview(reviewId: string, params?: any): Observable<ReviewResponse> {
    return this.api.get<ReviewResponse>(`reviews/${reviewId}`, params);
  }

  updateReview(reviewId: string, data: reviewRequest): Observable<ReviewResponse> {
    return this.api.put<ReviewResponse>(`reviews/${reviewId}`, data);
  }

  deleteReview(reviewId: string): Observable<Root> {
    return this.api.delete<Root>(`reviews/${reviewId}`);
  }
}
