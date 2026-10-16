import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MOCK_PRICE_HISTORY, MOCK_PRODUCTS } from '../data/mock-catalog';
import {
  Category,
  Deal,
  DealScore,
  Page,
  PricePoint,
  Product,
} from '../models/catalog.models';

/** Server response shapes (camelCase, from the FastAPI catalog API). */
interface ApiBrand {
  id: string;
  name: string;
  slug: string;
}
interface ApiCategoryLite {
  id: string;
  name: string;
  slug: string;
}
interface ApiVariant {
  id: string;
  sku?: string | null;
  attributes: Record<string, string | number>;
}
interface ApiImage {
  url: string;
  alt?: string | null;
}
interface ApiProduct {
  id: string;
  title: string;
  slug: string;
  specs: Record<string, string | number>;
  images: ApiImage[];
  brand: ApiBrand | null;
  category: ApiCategoryLite | null;
  variants: ApiVariant[];
}
interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}
interface ApiPage<T> {
  items: T[];
  meta: { page: number; pageSize: number; total: number; pages: number };
}

const LATENCY_MS = 200;

/**
 * Catalog data access. Products/brands/categories come from the FastAPI backend
 * (Phase 6); deals and price history remain on mock data until their phases
 * (12 and 11) wire them to the API.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/v1`;

  getProducts(category?: string): Observable<Page<Product>> {
    const params: Record<string, string> = { page: '1', page_size: '50' };
    if (category) {
      params['category'] = category;
    }
    return this.http
      .get<ApiPage<ApiProduct>>(`${this.base}/products`, { params })
      .pipe(map((res) => ({ items: res.items.map((p) => this.mapProduct(p)), total: res.meta.total })));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http
      .get<ApiPage<ApiProduct>>(`${this.base}/products`, { params: { page: '1', page_size: '4' } })
      .pipe(map((res) => res.items.map((p) => this.mapProduct(p))));
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.http.get<ApiProduct>(`${this.base}/products/${slug}`).pipe(
      map((p) => this.mapProduct(p)),
      catchError((err: { status?: number }) =>
        err?.status === 404 ? of(undefined) : throwError(() => err),
      ),
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<ApiPage<ApiCategory>>(`${this.base}/categories`, { params: { page: '1', page_size: '100' } })
      .pipe(
        map((res) =>
          res.items.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            productCount: c.productCount,
          })),
        ),
      );
  }

  search(query: string): Observable<Product[]> {
    const q = query.trim();
    if (!q) {
      return of<Product[]>([]);
    }
    return this.http
      .get<ApiPage<ApiProduct>>(`${this.base}/products`, { params: { page: '1', page_size: '50', q } })
      .pipe(map((res) => res.items.map((p) => this.mapProduct(p))));
  }

  // ----- Still mock until their dedicated phases ----------------------------

  getDeals(): Observable<Deal[]> {
    const scores: DealScore[] = ['excellent', 'good', 'normal', 'good', 'expensive', 'excellent'];
    const deals = MOCK_PRODUCTS.map((product, i) => ({
      id: `d-${product.id}`,
      product,
      score: scores[i % scores.length],
    }));
    return of(deals).pipe(delay(LATENCY_MS));
  }

  getPriceHistory(slug: string): Observable<PricePoint[]> {
    return of(MOCK_PRICE_HISTORY[slug] ?? []).pipe(delay(LATENCY_MS));
  }

  private mapProduct(api: ApiProduct): Product {
    return {
      id: api.id,
      title: api.title,
      slug: api.slug,
      brand: api.brand?.name ?? '',
      category: api.category?.slug ?? '',
      specs: api.specs ?? {},
      images: (api.images ?? []).map((i) => ({ url: i.url, alt: i.alt ?? undefined })),
      variants: (api.variants ?? []).map((v) => ({
        id: v.id,
        sku: v.sku ?? undefined,
        attributes: v.attributes,
      })),
      offers: [],
    };
  }
}
