import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ApiError } from '../../core/interceptors/error.interceptor';
import { CatalogService } from '../../core/services/catalog.service';
import { StatePanel } from '../../shared/state-panel';
import { TiltDirective } from '../../shared/tilt.directive';

interface Stat {
  label: string;
  value: number;
  icon: string;
}

@Component({
  selector: 'app-admin',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, StatePanel, TiltDirective],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private readonly catalog = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly stats = signal<Stat[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      products: this.catalog.getProducts(),
      categories: this.catalog.getCategories(),
      deals: this.catalog.getDeals(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ products, categories, deals }) => {
          const merchants = new Set(
            products.items.flatMap((p) => (p.offers ?? []).map((o) => o.merchant.id)),
          );
          this.stats.set([
            { label: 'Products', value: products.total, icon: 'inventory_2' },
            { label: 'Categories', value: categories.length, icon: 'category' },
            { label: 'Merchants', value: merchants.size, icon: 'storefront' },
            { label: 'Active deals', value: deals.length, icon: 'local_offer' },
          ]);
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
