import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BrandData } from '../../core/models/brand.interface';
import { CategoryData } from '../../core/models/category.interface';
import { ProductData } from '../../core/models/product.interface';
import { productParams } from '../../core/models/request.interface';
import { BrandService } from '../../core/services/brand/brand.service';
import { CategoryService } from '../../core/services/category/category.service';
import { ProductService } from '../../core/services/product/product.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-search',
  imports: [PageHeaderComponent, ProductCardComponent, FormsModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css',
})
export class ProductSearchComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  private readonly wishListService = inject(WishListService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly sortOptions = [
    { value: '', label: 'Relevance' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: '-ratingsAverage', label: 'Best Rated' },
    { value: 'title', label: 'A-Z' },
    { value: '-title', label: 'Z-A' },
  ];

  loading = signal<boolean>(false);
  loadingProducts = signal<boolean>(false);
  loadingCategories = signal<boolean>(false);
  loadingBrands = signal<boolean>(false);
  loadingFavorites = signal<boolean>(false);

  error = signal<string | null>(null);
  products = signal<ProductData[]>([]);
  selectedSort = signal<string>('featured');
  selectedSubcategory = signal<string>('');
  selectedCategories = signal<string[]>([]);
  selectedBrands = signal<string[]>([]);
  priceRange = signal<[number, number] | null>(null);
  selectedSearch = signal<string>('');
  favorites = signal<Set<string>>(new Set());
  categories = signal<CategoryData[]>([]);
  brands = signal<BrandData[]>([]);

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

  readonly isLoading = computed(
    () =>
      this.loadingProducts() ||
      this.loadingCategories() ||
      this.loadingBrands() ||
      this.loadingFavorites(),
  );

  readonly hasProducts = computed(() => this.products().length > 0);
  readonly hasError = computed(() => !!this.error());
  readonly showEmptyState = computed(
    () => !this.isLoading() && !this.hasError() && !this.hasProducts(),
  );
  readonly productCount = computed(() => this.products().length);

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.getParams();
    this.loadFavorites();
  }

  private getParams(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const sort = params.get('sort');
      const subcategory = params.get('subcategory');
      const category = params.get('category');
      const brand = params.get('brand');
      const priceMin = params.get('priceMin');
      const priceMax = params.get('priceMax');
      const search = params.get('q');

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
        this.selectedCategories.set([category]);
      }

      if (brand) {
        this.selectedBrands.set([brand]);
      }

      if (search) {
        this.selectedSearch.set(search);
      }

      // Handle price range
      if (priceMin) {
        this.priceRange.set([parseInt(priceMin), this.priceRange()![1]]);
      }

      if (priceMax) {
        this.priceRange.set([this.priceRange()![0], parseInt(priceMax)]);
      }

      this.loadProducts();
    });
  }

  private loadProducts(): void {
    debugger;
    this.loadingProducts.set(true);
    this.error.set(null);

    const queryParams: productParams = { page: 1, limit: 40 };

    if (this.selectedSubcategory()) {
      queryParams.subcategory = [this.selectedSubcategory()];
    }

    if (this.selectedCategories().length > 0) {
      queryParams.category = this.selectedCategories();
    }

    if (this.selectedBrands().length > 0) {
      queryParams.brand = this.selectedBrands().join(',');
    }

    if (this.selectedSearch()) {
      queryParams.q = this.selectedSearch();
    }

    if (this.priceRange() && this.priceRange()![0] > 0) {
      queryParams.minPrice = this.priceRange()![0];
    }

    if (this.priceRange() && this.priceRange()![1] < 5000) {
      queryParams.maxPrice = this.priceRange()![1];
    }

    this.productService
      .getAllProducts(queryParams)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loadingProducts.set(false);
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

  private loadCategories(): void {
    this.loadingCategories.set(true);
    this.error.set('');

    this.categoryService
      .getAllCategories()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loadingCategories.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.categories.set(res.data);
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  private loadBrands(): void {
    this.loadingBrands.set(true);
    this.error.set('');

    this.brandService
      .getAllBrands()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loadingBrands.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.brands.set(res.data);
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  private loadFavorites(): void {
    this.loadingFavorites.set(true);
    this.error.set(null);

    this.wishListService
      .getUserWishlist()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loadingFavorites.set(false);
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

  onSearchSubmit(): void {
    if (this.selectedSearch() && this.selectedSearch().trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.selectedSearch().trim() },
      });
    }
  }

  clearAllFilters(): void {
    this.selectedCategories.set([]);
    this.selectedSubcategory.set('');
    this.selectedBrands.set([]);
    this.selectedSearch.set('');
    this.priceRange.set(null);
    this.selectedSort.set('featured');
    this.loadProducts();
  }

  onCategoryChange(event: Event, categoryId: string): void {
    const checkbox = event.target as HTMLInputElement;
    const currentCategories = this.selectedCategories();

    if (checkbox.checked) {
      if (!currentCategories.includes(categoryId)) {
        this.selectedCategories.set([...currentCategories, categoryId]);
      }
    } else {
      this.selectedCategories.set(currentCategories.filter((id) => id !== categoryId));
    }
    this.loadProducts();
  }

  onBrandChange(event: Event, brandId: string): void {
    const checkbox = event.target as HTMLInputElement;
    const currentBrands = this.selectedBrands();

    if (checkbox.checked) {
      if (!currentBrands.includes(brandId)) {
        this.selectedBrands.set([...currentBrands, brandId]);
      }
    } else {
      this.selectedBrands.set(currentBrands.filter((id) => id !== brandId));
    }
    this.loadProducts();
  }

  onPriceRangeChange(min: HTMLInputElement, max: HTMLInputElement): void {
    const minPrice = parseInt(min.value) || 0;
    const maxPrice = parseInt(max.value) || 5000;

    if (minPrice === 0 && maxPrice === 5000) {
      this.priceRange.set(null);
    } else {
      this.priceRange.set([minPrice, maxPrice]);
    }
    this.loadProducts();
  }

  onQuickPriceChange(min: number, max: number): void {
    this.priceRange.set([min, max]);
    this.loadProducts();
  }
}
