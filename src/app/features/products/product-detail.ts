import { DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of, switchMap, tap } from 'rxjs';

import { ApiError } from '../../core/interceptors/error.interceptor';
import { Product } from '../../core/models/catalog.models';
import { CatalogService } from '../../core/services/catalog.service';
import { cheapestOffer, offersByPrice, priceRange } from '../../core/utils/pricing';
import { InrPipe } from '../../shared/inr.pipe';
import { StatePanel } from '../../shared/state-panel';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, MatButtonModule, MatIconModule, DatePipe, InrPipe, StatePanel],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly catalog = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);

  /** Bound from the `:slug` route parameter via withComponentInputBinding(). */
  readonly slug = input.required<string>();

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly cheapest = computed(() => {
    const p = this.product();
    return p ? cheapestOffer(p) : null;
  });
  protected readonly sortedOffers = computed(() => {
    const p = this.product();
    return p ? offersByPrice(p) : [];
  });
  protected readonly range = computed(() => {
    const p = this.product();
    return p ? priceRange(p) : null;
  });
  protected readonly specEntries = computed(() => {
    const p = this.product();
    return p ? Object.entries(p.specs) : [];
  });

  constructor() {
    toObservable(this.slug)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((slug) =>
          this.catalog.getProductBySlug(slug).pipe(
            catchError((err: ApiError) => {
              this.error.set(err.message);
              return of(undefined);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((product) => {
        this.product.set(product ?? null);
        this.loading.set(false);
      });
  }

  availabilityLabel(value: string): string {
    return value === 'in_stock' ? 'In stock' : value === 'out_of_stock' ? 'Out of stock' : 'Unknown';
  }

  attrText(attributes: Record<string, string | number>): string {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  reload(): void {
    this.error.set(null);
    this.loading.set(true);
    this.catalog
      .getProductBySlug(this.slug())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.product.set(product ?? null);
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
