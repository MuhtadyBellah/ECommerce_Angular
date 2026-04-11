import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ProductData } from '../../core/models/product.interface';
import { ProductService } from '../../core/services/product/product.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product',
  imports: [
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ProductCardComponent,
    PageHeaderComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);

  readonly sortOptions = [
    { value: 'featured', label: 'Sort by: Featured' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Best Rated' },
  ] as const;

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  products = signal<ProductData[]>([]);
  selectedSort = signal<string>('featured');

  ngOnInit(): void {
    this.loadProducts();
  }

  readonly sortedProducts = computed(() => {
    const products = this.products();
    const sortType = this.selectedSort();

    if (!products || products.length === 0) return products;

    const sorted = [...products];

    switch (sortType) {
      case 'price-low-high':
        return sorted.sort(
          (a, b) => (a.priceAfterDiscount || a.price) - (b.priceAfterDiscount || b.price),
        );
      case 'price-high-low':
        return sorted.sort(
          (a, b) => (b.priceAfterDiscount || b.price) - (a.priceAfterDiscount || a.price),
        );
      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime(),
        );
      case 'rating':
        return sorted.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
      case 'featured':
      default:
        return sorted.sort((a, b) => (b._id || '').localeCompare(a._id || ''));
    }
  });

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getAllProducts({ limit: 40 })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          this.products.set(data);
        },
        error: (err) => {
          console.error('Failed to load products:', err);
          this.error.set('Failed to load products. Please try again later.');
        },
      });
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort.set(select.value);
  }

  retry(): void {
    this.loadProducts();
  }
}
