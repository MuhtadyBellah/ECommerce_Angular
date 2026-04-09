import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CartData } from '../../core/models/cart.interface';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cartService = inject(CartService);

  cart = signal<CartData | null>(null);

  ngOnInit(): void {
    this.getUserCart();
  }

  private getUserCart(): void {
    this.cartService
      .getUserCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cart.set(res.data);
        },
      });
  }

  deleteOne(proudctId: string, count: number): void {
    this.cartService.updateProduct(proudctId, count).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  addOne(proudctId: string, count: number): void {
    this.cartService.updateProduct(proudctId, count).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  deleteProduct(proudctId: string): void {
    this.cartService.deleteProduct(proudctId).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  clearCart(): void {
    this.cartService.clearUserCart().subscribe({
      next: () => {},
      error: () => {},
    });
  }
}
