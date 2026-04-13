import { CurrencyPipe, NgClass } from '@angular/common';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { ProductData } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductService } from '../../core/services/product/product.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { DetailDescriptionComponent } from '../../shared/components/detail-description/detail-description.component';
import { DetailReviewsComponent } from '../../shared/components/detail-reviews/detail-reviews.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    RouterLink,
    PageHeaderComponent,
    NgClass,
    DetailDescriptionComponent,
    DetailReviewsComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailsComponent implements OnInit {
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService);

  product = signal<ProductData>({} as ProductData);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedImage = signal<string>('');
  quantity = signal<number>(1);
  addingToCart = signal<boolean>(false);
  addingToFavorites = signal<boolean>(false);
  detailsTab = signal<'description' | 'reviews' | 'shipping'>('description');

  readonly isInStock = computed(() => {
    const product = this.product();
    return product && product.quantity > 0;
  });

  readonly maxQuantity = computed(() => {
    const product = this.product();
    return product ? Math.min(product.quantity, 10) : 1;
  });

  readonly discountPercentage = computed(() => {
    const product = this.product();
    if (!product || !product.priceAfterDiscount) return 0;
    return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
  });

  ngOnInit(): void {
    this.getProduct();
  }

  private getProduct(): void {
    this.loading.set(true);
    this.error.set(null);

    const productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!productId) {
      this.error.set('Product ID not found');
      this.loading.set(false);
      return;
    }

    this.productService
      .getProduct(productId!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (res) => {
          console.log('log', res);
          this.product.set(res.data);
          this.selectedImage.set(res.data.imageCover);
        },
        error: (err: any) => {
          console.error('Failed to load product:', err);
          this.error.set('Failed to load product. Please try again later.');
        },
      });
  }

  copyLink() {
    const url = window.location.href;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.toastr.success('Link copied!', 'Clipboard');
      })
      .catch(() => {
        console.error('Failed to copy');
      });
  }

  addToCart(): void {
    if (!this.isInStock() || this.addingToCart()) return;

    const productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!productId) return;

    this.addingToCart.set(true);

    this.cartService
      .addProduct(productId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.addingToCart.set(false)),
      )
      .subscribe({
        next: () => {},
        error: (err: any) => {
          console.error('Failed to add product to cart:', err);
        },
      });
  }

  addFavorite(): void {
    if (!this.product() || this.addingToFavorites()) return;

    this.addingToFavorites.set(true);

    this.wishListService
      .addProduct(this.product()!._id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.addingToFavorites.set(false)),
      )
      .subscribe({
        next: () => {},
        error: (err: any) => {
          console.error('Failed to add to wishlist:', err);
        },
      });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  incrementQuantity(): void {
    if (this.quantity() < this.maxQuantity()) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  retry(): void {
    this.getProduct();
  }
}
