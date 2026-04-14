import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { CategoryData } from '../../core/models/category.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { CategoryService } from '../../core/services/category/category.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishListService);

  readonly currentUser = this.authService.currentUser;
  readonly isAuthinticated = this.authService.isAuthenticated;
  readonly isMobileMenuOpen = signal(false);
  readonly isProfileOpen = signal(false);
  readonly searchTerm = signal<string>('');

  cartCount = signal<number>(0);
  favoriteCount = signal<number>(0);
  categories = signal<CategoryData[]>([]);

  ngOnInit(): void {
    if (this.isAuthinticated()) {
      this.getUserCart();
      this.loadFavorites();
    }

    interval(30000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isAuthinticated()) {
          this.getUserCart();
          this.loadFavorites();
        }
      });

    this.loadCategories();
  }

  private loadFavorites(): void {
    this.wishListService
      .getUserWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.favoriteCount.set(res.count);
        },
        error: () => {},
      });
  }

  private getUserCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartCount.set(res.numOfCartItems);
      },
      error: () => {},
    });
  }

  private loadCategories(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.categories.set(response.data);
        },
        error: () => {},
      });
  }

  viewMobile() {
    this.isMobileMenuOpen.set(true);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleProfile(): void {
    this.isProfileOpen.set(!this.isProfileOpen());
  }

  onSearchSubmit(): void {
    if (this.searchTerm() && this.searchTerm().trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchTerm().trim() },
      });
    }
  }
}
