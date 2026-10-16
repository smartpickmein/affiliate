import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ApiError } from '../../core/interceptors/error.interceptor';
import { Category } from '../../core/models/catalog.models';
import { CatalogService } from '../../core/services/catalog.service';
import { StatePanel } from '../../shared/state-panel';
import { TiltDirective } from '../../shared/tilt.directive';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, MatCardModule, MatIconModule, StatePanel, TiltDirective],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  private readonly catalog = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.catalog
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.loading.set(false);
        },
        error: (err: ApiError) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
