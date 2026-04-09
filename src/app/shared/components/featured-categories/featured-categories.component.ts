import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoryData } from '../../../core/models/category.interface';
import { CategoryService } from '../../../core/services/category/category.service';

@Component({
  selector: 'app-featured-categories',
  imports: [RouterLink],
  templateUrl: './featured-categories.component.html',
  styleUrl: './featured-categories.component.css',
})
export class FeaturedCategoriesComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly categoryService = inject(CategoryService);

  categories = signal<CategoryData[]>([]);

  ngOnInit(): void {
    this.getAllCategoriesData();
  }

  private getAllCategoriesData(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          this.categories.set(data);
        },
        error: () => {},
      });
  }
}
