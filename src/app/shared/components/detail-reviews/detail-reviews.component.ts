import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ProductData } from '../../../core/models/product.interface';
import { ReviewData } from '../../../core/models/review.interface';
import { ReviewService } from '../../../core/services/review/review.service';

@Component({
  selector: 'app-detail-reviews',
  imports: [],
  templateUrl: './detail-reviews.component.html',
  styleUrl: './detail-reviews.component.css',
})
export class DetailReviewsComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reviewService = inject(ReviewService);

  readonly product = input.required<ProductData>();

  reviews = signal<ReviewData[]>([]);
  reviewForm = signal<{ rating: number; review: string }>({ rating: 5, review: '' });
  submittingReview = signal<boolean>(false);
  loadingReviews = signal<boolean>(true);
  reviewsError = signal<string | null>(null);

  reviewStats = computed(() => {
    const reviews = this.reviews();
    if (reviews.length === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      stats[review.rating as keyof typeof stats]++;
    });
    return stats;
  });

  ngOnInit(): void {
    this.getReviewsProduct();
  }

  private getReviewsProduct(): void {
    this.loadingReviews.set(true);
    this.reviewsError.set(null);

    this.reviewService
      .getReviewsProduct(this.product()._id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingReviews.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.reviews.set(res.data);
        },
        error: (err: any) => {
          console.error('Failed to load reviews:', err);
          this.reviewsError.set('Failed to load reviews. Please try again later.');
        },
      });
  }

  submitReview(): void {
    this.submittingReview.set(true);

    this.reviewService
      .addReview(this.product()._id, this.reviewForm())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.submittingReview.set(false)),
      )
      .subscribe({
        next: (newReview) => {
          this.reviews.update((reviews) => [newReview.data, ...reviews]);
          this.reviewForm.set({ rating: 5, review: '' });
          this.toastr.success('Review submitted successfully!');
        },
        error: (err: any) => {
          console.error('Failed to submit review:', err);
          this.toastr.error('Failed to submit review. Please try again.');
        },
      });
  }

  setRating(rating: number): void {
    this.reviewForm.update((form) => ({ ...form, rating }));
  }

  getReviewPercentage(rating: number): number {
    const stats = this.reviewStats();
    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    return total > 0 ? Math.round((stats[rating as keyof typeof stats] / total) * 100) : 0;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  retry(): void {
    this.getReviewsProduct();
  }
}
