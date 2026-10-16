import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { ApiError } from '../../core/interceptors/error.interceptor';
import { Deal, Product } from '../../core/models/catalog.models';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCard } from '../../shared/product-card';
import { StatePanel } from '../../shared/state-panel';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, ProductCard, StatePanel],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly catalog = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly deals = signal<Deal[]>([]);
  protected readonly featured = signal<Product[]>([]);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.catalog
      .getDeals()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deals) => this.deals.set(deals),
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
    this.catalog
      .getFeaturedProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.featured.set(products);
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
