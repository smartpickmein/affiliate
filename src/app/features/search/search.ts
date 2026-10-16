import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ApiError } from '../../core/interceptors/error.interceptor';
import { Product } from '../../core/models/catalog.models';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCard } from '../../shared/product-card';
import { StatePanel } from '../../shared/state-panel';

@Component({
  selector: 'app-search',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ProductCard,
    StatePanel,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private readonly catalog = inject(CatalogService);
  protected readonly query = signal('');
  protected readonly results = signal<Product[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly searched = signal(false);

  submit(event: Event): void {
    event.preventDefault();
    this.run();
  }

  run(): void {
    const q = this.query().trim();
    if (!q) {
      this.results.set([]);
      this.searched.set(false);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.catalog.search(q).subscribe({
      next: (products) => {
        this.results.set(products);
        this.searched.set(true);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
