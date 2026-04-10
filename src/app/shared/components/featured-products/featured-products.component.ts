import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ProductData } from '../../../core/models/product.interface';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from './../../../core/services/product/product.service';

@Component({
  selector: 'app-featured-products',
  imports: [ProductCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);

  products = signal<ProductData[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.getAllProductsData();
  }

  private getAllProductsData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getAllProducts()
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

  retry(): void {
    this.getAllProductsData();
  }
}
