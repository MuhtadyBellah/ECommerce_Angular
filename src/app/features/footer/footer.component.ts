import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoryData } from '../../core/models/category.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { CategoryService } from '../../core/services/category/category.service';
import { FeaduredSideComponent } from '../../shared/components/feadured-side/feadured-side.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FeaduredSideComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;

  categories = signal<CategoryData[]>([]);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.categories.set(response.data);
        },
        error: () => {},
      });
  }
}
