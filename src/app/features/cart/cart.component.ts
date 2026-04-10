import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CartData } from '../../core/models/cart.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-cart',
  imports: [
    CurrencyPipe,
    RouterLink,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PageHeaderComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartService = inject(CartService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  updating = signal<boolean>(false);
  cart = signal<CartData | null>(null);

  ngOnInit(): void {
    this.getUserCart();
  }

  private getUserCart(): void {
    this.loading.set(true);
    this.error.set(null);

    this.cartService
      .getUserCart()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.cart.set(res.data);
        },
        error: (err) => {
          console.error('Failed to load cart:', err);
          this.error.set('Failed to load your cart. Please try again later.');
        },
      });
  }

  deleteOne(productId: string, count: number): void {
    this.updating.set(true);
    this.cartService
      .updateProduct(productId, count)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.updating.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.getUserCart(); // Refresh cart data
        },
        error: (err) => {
          console.error('Failed to update product quantity:', err);
        },
      });
  }

  addOne(productId: string, count: number): void {
    this.updating.set(true);
    this.cartService
      .updateProduct(productId, count)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.updating.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.getUserCart(); // Refresh cart data
        },
        error: (err) => {
          console.error('Failed to update product quantity:', err);
        },
      });
  }

  deleteProduct(productId: string): void {
    this.updating.set(true);
    this.cartService
      .deleteProduct(productId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.updating.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.getUserCart(); // Refresh cart data
        },
        error: (err) => {
          console.error('Failed to remove product from cart:', err);
        },
      });
  }

  clearCart(): void {
    this.updating.set(true);
    this.cartService
      .clearUserCart()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.updating.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.getUserCart(); // Refresh cart data
        },
        error: (err) => {
          console.error('Failed to clear cart:', err);
        },
      });
  }

  retry(): void {
    this.getUserCart();
  }
}
