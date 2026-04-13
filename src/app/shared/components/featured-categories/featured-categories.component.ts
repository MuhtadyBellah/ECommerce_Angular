import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CategoryData } from '../../../core/models/category.interface';
import { CategoryService } from '../../../core/services/category/category.service';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-featured-categories',
  imports: [RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './featured-categories.component.html',
  styleUrl: './featured-categories.component.css',
})
export class FeaturedCategoriesComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly categoryService = inject(CategoryService);

  categories = signal<CategoryData[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.getAllCategoriesData();
  }

  private getAllCategoriesData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService
      .getAllCategories()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.categories.set(res.data);
        },
        error: (err) => {
          console.error('Failed to load categories:', err);
          this.error.set('Failed to load categories. Please try again later.');
        },
      });
  }

  retry(): void {
    this.getAllCategoriesData();
  }
}
