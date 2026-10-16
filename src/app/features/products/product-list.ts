import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of, switchMap, tap } from 'rxjs';

import { ApiError } from '../../core/interceptors/error.interceptor';
import { Category, Product } from '../../core/models/catalog.models';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCard } from '../../shared/product-card';
import { StatePanel } from '../../shared/state-panel';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, MatButtonModule, ProductCard, StatePanel],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly catalog = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);

  /** Bound from the `?category=` query parameter via withComponentInputBinding(). */
  readonly category = input<string | undefined>();

  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.catalog
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (c) => this.categories.set(c) });

    toObservable(this.category)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((category) =>
          this.catalog.getProducts(category).pipe(
            catchError((err: ApiError) => {
              this.error.set(err.message);
              return of({ items: [] as Product[], total: 0 });
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        this.products.set(page.items);
        this.loading.set(false);
      });
  }

  reload(): void {
    this.error.set(null);
    this.loading.set(true);
    this.catalog
      .getProducts(this.category())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.products.set(page.items);
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
