import { CurrencyPipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductData } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductService } from '../../core/services/product/product.service';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly stars = signal([0, 1, 2, 3, 4]);
  product = signal<ProductData | null>(null);

  ngOnInit(): void {
    this.getProduct();
  }

  private getProduct(): void {
    const productId = this.activatedRoute.snapshot.paramMap.get('id');

    this.productService
      .getProduct(productId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const data = Array.isArray(res.data) ? res.data[0] : res.data;
          this.product.set(data);
        },
      });
  }

  addToCart(): void {
    const productId = this.activatedRoute.snapshot.paramMap.get('id');

    this.cartService.addProduct(productId!).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  addFavorite(): void {}
}
