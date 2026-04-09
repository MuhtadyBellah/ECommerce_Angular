import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductData } from '../../../core/models/product.interface';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from './../../../core/services/product/product.service';

@Component({
  selector: 'app-featured-products',
  imports: [ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);

  products = signal<ProductData[]>([]);

  ngOnInit(): void {
    this.getAllProductsData();
  }

  private getAllProductsData(): void {
    this.productService
      .getAllProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          this.products.set(data);
        },
        error: () => {},
      });
  }
}
