import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CartData } from '../../core/models/cart.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, EmptyStateComponent, PageHeaderComponent, NgClass],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartService = inject(CartService);

  readonly FREE_SHIPPING_THRESHOLD = 500;
  readonly SHIPPING_COST = 50;

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  updating = signal<boolean>(false);
  cart = signal<CartData | null>(null);

  shippingProgress = computed(() => {
    const cartTotal = this.cart()?.totalCartPrice || 0;
    const progress = (cartTotal / this.FREE_SHIPPING_THRESHOLD) * 100;
    return Math.min(progress, 100);
  });

  amountForFreeShipping = computed(() => {
    const cartTotal = this.cart()?.totalCartPrice || 0;
    return Math.max(0, this.FREE_SHIPPING_THRESHOLD - cartTotal);
  });

  hasFreeShipping = computed(() => {
    const cartTotal = this.cart()?.totalCartPrice || 0;
    return cartTotal >= this.FREE_SHIPPING_THRESHOLD;
  });

  totalWithShipping = computed(() => {
    const cartTotal = this.cart()?.totalCartPrice || 0;
    return this.hasFreeShipping() ? cartTotal : cartTotal + this.SHIPPING_COST;
  });

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
