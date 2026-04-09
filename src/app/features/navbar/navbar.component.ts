import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { CategoryData } from '../../core/models/category.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { CategoryService } from '../../core/services/category/category.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  readonly currentUser = this.authService.currentUser;
  readonly isAuthinticated = this.authService.isAuthenticated;
  readonly isMobileMenuOpen = signal(false);
  readonly isProfileOpen = signal(false);

  cartCount = signal<number>(0);
  categories = signal<CategoryData[] | null>(null);

  ngOnInit(): void {
    if (this.isAuthinticated()) {
      this.getUserCart();

      interval(300000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.getUserCart());
    }
    this.loadCategories();
  }

  private getUserCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartCount.set(res.numOfCartItems);
      },
    });
  }

  private loadCategories(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.categories.set(response.data || null);
        },
        error: () => {
          this.categories.set(null);
        },
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
}
