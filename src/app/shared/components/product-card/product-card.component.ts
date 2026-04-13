import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { ProductData } from './../../../core/models/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, NgClass],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartService = inject(CartService);

  readonly product = input.required<ProductData>();
  readonly isWishlisted = input.required<boolean>();
  readonly addFavorite = output<ProductData>();

  readonly isInStock = computed(() => {
    const product = this.product();
    return product && product.quantity > 0;
  });

  readonly hasDiscount = computed(() => {
    const product = this.product();
    return product && product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  });

  readonly discountPercentage = computed(() => {
    const product = this.product();
    if (!product || !product.priceAfterDiscount) return 0;
    return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
  });

  getRatingStars(): number {
    const product = this.product();
    return Math.floor(product?.ratingsAverage || 0);
  }

  toggleWishlist(product: ProductData): void {
    this.addFavorite.emit(product);
  }

  addToCart(productId: string): void {
    if (!this.isInStock()) return;

    this.cartService
      .addProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Failed to add product to cart:', error);
        },
      });
  }
}
