import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SubCategoryData } from '../../core/models/sub-category.interface';
import { SubCategoryService } from '../../core/services/subCategory/sub-category.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-sub-category',
  imports: [RouterLink, LoadingSpinnerComponent, EmptyStateComponent, PageHeaderComponent],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.css',
})
export class SubCategoryComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly route = inject(ActivatedRoute);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  subCategories = signal<SubCategoryData[]>([]);
  categoryName = signal<string>('');

  ngOnInit(): void {
    this.loadSubCategories();
  }

  private loadSubCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    const categoryId = this.route.snapshot.paramMap.get('id');

    this.subCategoryService
      .getSubCategoriesMainCategory(categoryId!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.subCategories.set(res.data);
        },
        error: (err: any) => {
          console.error('Failed to load subcategories:', err);
          this.error.set('Failed to load subcategories. Please try again later.');
        },
      });
  }

  retry(): void {
    this.loadSubCategories();
  }
}
