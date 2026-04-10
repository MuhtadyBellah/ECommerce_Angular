import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  products = signal<ProductData[]>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

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

  retry(): void {
    this.loadProducts();
  }
}
