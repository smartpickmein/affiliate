import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';

import { ApiError } from '../../core/interceptors/error.interceptor';
import { PricePoint, Product } from '../../core/models/catalog.models';
import { CatalogService } from '../../core/services/catalog.service';
import { InrPipe } from '../../shared/inr.pipe';
import { StatePanel } from '../../shared/state-panel';

interface Loaded {
  product: Product | undefined;
  history: PricePoint[];
}

@Component({
  selector: 'app-price-history',
  imports: [RouterLink, MatIconModule, InrPipe, StatePanel],
  templateUrl: './price-history.html',
  styleUrl: './price-history.scss',
})
export class PriceHistory {
  private readonly catalog = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);

  /** Bound from the `:slug` route parameter. */
  readonly slug = input.required<string>();

  protected readonly product = signal<Product | undefined>(undefined);
  protected readonly history = signal<PricePoint[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly prices = computed(() => this.history().map((p) => p.price));
  protected readonly current = computed(() => this.prices().at(-1) ?? null);
  protected readonly lowest = computed(() =>
    this.prices().length ? Math.min(...this.prices()) : null,
  );
  protected readonly highest = computed(() =>
    this.prices().length ? Math.max(...this.prices()) : null,
  );
  protected readonly average = computed(() => {
    const p = this.prices();
    return p.length ? Math.round(p.reduce((a, b) => a + b, 0) / p.length) : null;
  });
  protected readonly reversed = computed(() => [...this.history()].reverse());

  /** Build an SVG polyline (viewBox 320x100) scaled to the price range. */
  protected readonly linePoints = computed(() => {
    const prices = this.prices();
    if (prices.length < 2) {
      return '';
    }
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;
    const stepX = 320 / (prices.length - 1);
    return prices
      .map((price, i) => {
        const x = i * stepX;
        const y = 100 - ((price - min) / span) * 90 - 5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  constructor() {
    toObservable(this.slug)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((slug) =>
          forkJoin({
            product: this.catalog.getProductBySlug(slug),
            history: this.catalog.getPriceHistory(slug),
          }).pipe(
            catchError((err: ApiError) => {
              this.error.set(err.message);
              return of<Loaded>({ product: undefined, history: [] });
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ product, history }) => {
        this.product.set(product);
        this.history.set(history);
        this.loading.set(false);
      });
  }

  reload(): void {
    this.error.set(null);
    this.loading.set(true);
    forkJoin({
      product: this.catalog.getProductBySlug(this.slug()),
      history: this.catalog.getPriceHistory(this.slug()),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ product, history }) => {
          this.product.set(product);
          this.history.set(history);
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
