import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductData } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-wishlist',
  imports: [
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PageHeaderComponent,
    RouterLink,
    CurrencyPipe,
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly wishlistService = inject(WishListService);
  private readonly cartService = inject(CartService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  wishlist = signal<ProductData[]>([]);

  ngOnInit(): void {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    this.loading.set(true);
    this.error.set(null);

    this.wishlistService
      .getUserWishlist()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res: any) => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          this.wishlist.set(data);
        },
        error: (err: any) => {
          console.error('Failed to load wishlist:', err);
          this.error.set('Failed to load your wishlist. Please try again later.');
        },
      });
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService
      .deleteProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadWishlist(); // Refresh wishlist data
        },
        error: (err: any) => {
          console.error('Failed to remove from wishlist:', err);
        },
      });
  }

  retry(): void {
    this.loadWishlist();
  }

  addToCart(productId: string): void {
    this.cartService
      .addProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: () => {},
      });
  }
}
