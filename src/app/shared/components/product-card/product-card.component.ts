import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { ProductData } from './../../../core/models/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartService = inject(CartService);

  readonly product = input.required<ProductData>();

  favorite(): void {}
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
