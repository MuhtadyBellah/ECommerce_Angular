import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductData } from '../../core/models/product.interface';
import { productParams } from '../../core/models/request.interface';
import { ProductService } from '../../core/services/product/product.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product',
  imports: [
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ProductCardComponent,
    PageHeaderComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);
  private readonly wishListService = inject(WishListService);
  private readonly route = inject(ActivatedRoute);

  readonly sortOptions = [
    { value: 'featured', label: 'Sort by: Featured' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Best Rated' },
    { value: 'title', label: 'A-Z' },
    { value: '-title', label: 'Z-A' },
  ];

  products = signal<ProductData[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  selectedSort = signal<string>('featured');
  selectedSubcategory = signal<string>('');
  selectedCategory = signal<string>('');
  selectedBrand = signal<string>('');
  selectedSearch = signal<string>('');
  favorites = signal<Set<string>>(new Set());

  readonly sortedProducts = computed(() => {
    const products = this.products();
    const sortType = this.selectedSort();

    if (!products || products.length === 0) return products;

    const sorted = [...products];

    switch (sortType) {
      case 'price':
        return sorted.sort(
          (a, b) => (a.priceAfterDiscount || a.price) - (b.priceAfterDiscount || b.price),
        );
      case '-price':
        return sorted.sort(
          (a, b) => (b.priceAfterDiscount || b.price) - (a.priceAfterDiscount || a.price),
        );
      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime(),
        );
      case 'rating':
        return sorted.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case '-title':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'featured':
      default:
        return sorted.sort((a, b) => b._id.localeCompare(a._id));
    }
  });

  ngOnInit(): void {
    this.getParams();
    this.loadFavorites();
  }

  private getParams(): void {
    this.route.queryParamMap.subscribe((params) => {
      const sort = params.get('sort');
      const subcategory = params.get('subcategory');
      const category = params.get('category');
      const brand = params.get('brand');
      const priceMin = params.get('priceMin');
      const priceMax = params.get('priceMax');
      const search = params.get('search');

      // Handle sorting
      if (sort) {
        this.selectedSort.set(sort);
      }

      // Handle filtering
      if (subcategory) {
        this.selectedSubcategory.set(subcategory);
        console.log('Filtering by subcategory:', subcategory);
      }

      if (category) {
        this.selectedCategory.set(category);
      }

      if (brand) {
        this.selectedBrand.set(brand);
      }

      if (search) {
        this.selectedSearch.set(search);
      }

      this.loadProducts();
    });
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    const queryParams: productParams = { page: 1, limit: 40 };

    if (this.selectedSubcategory()) {
      queryParams.subcategory = [this.selectedSubcategory()];
    }

    if (this.selectedCategory()) {
      queryParams.category = [this.selectedCategory()];
    }

    if (this.selectedBrand()) {
      queryParams.brand = this.selectedBrand();
    }

    if (this.selectedSearch()) {
      queryParams.q = this.selectedSearch();
    }

    this.productService
      .getAllProducts(queryParams)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
        },
        error: (err) => {
          console.error('Failed to load products:', err);
          this.error.set('Failed to load products. Please try again later.');
        },
      });
  }

  private loadFavorites(): void {
    this.loading.set(true);
    this.error.set(null);

    this.wishListService
      .getUserWishlist()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          const favIDS = res.data.map((d) => d._id);
          this.products.update((p) =>
            p.map((product) => ({
              ...product,
              isFavorite: favIDS.includes(product._id),
            })),
          );
        },
        error: (err) => {
          console.error('Failed to load products:', err);
          this.error.set('Failed to load products. Please try again later.');
        },
      });
  }

  addFavorite(product: ProductData) {
    if (product.isFavorite) {
      this.wishListService
        .deleteProduct(product._id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            product.isFavorite = false;
          },
          error: (error) => {
            console.error('Failed to remove from wishlist:', error);
          },
        });
    } else {
      this.wishListService
        .addProduct(product._id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            product.isFavorite = true;
          },
          error: (error) => {
            console.error('Failed to add to wishlist:', error);
          },
        });
    }
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort.set(select.value);
  }

  retry(): void {
    this.loadProducts();
  }

  clearAllFilters(): void {
    this.selectedCategory.set('');
    this.selectedSubcategory.set('');
    this.selectedBrand.set('');
    this.selectedSearch.set('');
    this.selectedSort.set('featured');
    this.loadProducts();
  }
}
