import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApiError } from '../../core/interceptors/error.interceptor';
import { Deal } from '../../core/models/catalog.models';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCard } from '../../shared/product-card';
import { StatePanel } from '../../shared/state-panel';

@Component({
  selector: 'app-deals',
  imports: [ProductCard, StatePanel],
  templateUrl: './deals.html',
  styleUrl: './deals.scss',
})
export class Deals {
  private readonly catalog = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly deals = signal<Deal[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

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
        next: (deals) => {
          this.deals.set(deals);
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
