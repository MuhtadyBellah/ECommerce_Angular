import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BrandData } from '../../core/models/brand.interface';
import { BrandService } from '../../core/services/brand/brand.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-brands',
  imports: [PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly brandService = inject(BrandService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  brands = signal<BrandData[]>([]);

  ngOnInit(): void {
    this.loadBrans();
  }

  private loadBrans(): void {
    this.loading.set(true);
    this.error.set(null);

    this.brandService
      .getAllBrands()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.brands.set(res.data);
        },
        error: (err) => {
          console.error('Failed to load brands:', err);
          this.error.set('Failed to load brands. Please try again later.');
        },
      });
  }

  retry(): void {
    this.loadBrans();
  }
}
