import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishListService } from '../../../core/services/wishList/wish-list.service';
import { ProductData } from './../../../core/models/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, NgClass],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService);

  readonly product = input.required<ProductData>();
  readonly isWishlisted = signal<boolean>(false);

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

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.wishListService
      .getUserWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const currentProductId = this.product()._id;
          const wishlistData = res.data || [];
          const isProductInWishlist = Array.isArray(wishlistData)
            ? wishlistData.some((item: any) => item._id === currentProductId)
            : false;
          this.isWishlisted.set(isProductInWishlist);
        },
        error: () => {
          this.isWishlisted.set(false);
        },
      });
  }

  getRatingStars(): number {
    const product = this.product();
    return Math.floor(product?.ratingsAverage || 0);
  }

  toggleWishlist(productId: string): void {
    const currentlyWishlisted = this.isWishlisted();

    if (currentlyWishlisted) {
      this.wishListService
        .deleteProduct(productId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isWishlisted.set(!this.isWishlisted());
          },
          error: (error) => {
            console.error('Failed to remove from wishlist:', error);
          },
        });
    } else {
      this.wishListService
        .addProduct(productId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isWishlisted.set(!this.isWishlisted());
          },
          error: (error) => {
            console.error('Failed to add to wishlist:', error);
          },
        });
    }
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
