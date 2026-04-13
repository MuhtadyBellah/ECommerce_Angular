import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ProductData } from '../../../core/models/product.interface';
import { WishListService } from '../../../core/services/wishList/wish-list.service';
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
  private readonly wishListService = inject(WishListService);

  products = signal<ProductData[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.getAllProductsData();
    this.loadFavorites();
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
          this.products.set(res.data);
        },
        error: (err) => {
          console.error('Failed to load products:', err);
          this.error.set('Failed to load products. Please try again later.');
        },
      });
  }

  private loadFavorites(): void {
    this.loading.set(true);
    this.error.set(null);

    this.wishListService
      .getUserWishlist()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          const favIDS = res.data.map((d) => d._id);
          this.products.update((p) =>
            p.map((product) => ({
              ...product,
              isFavorite: favIDS.includes(product._id),
            })),
          );
        },
        error: (err) => {
          console.error('Failed to load products:', err);
          this.error.set('Failed to load products. Please try again later.');
        },
      });
  }

  addFavorite(product: ProductData) {
    if (product.isFavorite) {
      this.wishListService
        .deleteProduct(product._id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            product.isFavorite = false;
          },
          error: (error) => {
            console.error('Failed to remove from wishlist:', error);
          },
        });
    } else {
      this.wishListService
        .addProduct(product._id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            product.isFavorite = true;
          },
          error: (error) => {
            console.error('Failed to add to wishlist:', error);
          },
        });
    }
  }

  retry(): void {
    this.getAllProductsData();
  }
}
