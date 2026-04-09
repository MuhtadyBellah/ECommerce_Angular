import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly activatedRoute = inject(ActivatedRoute);

  cartId = signal<string>('');

  ngOnInit(): void {
    this.getCartId();
    if (this.cartId()) {
      this.cartId();
    }
  }

  private getCartId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (url) => {
        this.cartId.set(url.get('id') || '');
      },
    });
  }
}
