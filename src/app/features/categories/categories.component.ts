import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CategoryData } from '../../core/models/category.interface';
import { CategoryService } from '../../core/services/category/category.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-categories',
  imports: [LoadingSpinnerComponent, EmptyStateComponent, RouterLink, PageHeaderComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly categoryService = inject(CategoryService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  categories = signal<CategoryData[]>([]);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
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
          const data = Array.isArray(res.data) ? res.data : [res.data];
          this.categories.set(data);
        },
        error: (err) => {
          console.error('Failed to load categories:', err);
          this.error.set('Failed to load categories. Please try again later.');
        },
      });
  }

  retry(): void {
    this.loadCategories();
  }
}
