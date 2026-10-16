import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Category, Product } from '../models/catalog.models';
import { CatalogService } from './catalog.service';

const BASE = `${environment.apiBaseUrl}/api/v1`;

function apiProduct() {
  return {
    id: 'p1',
    title: 'Samsung Galaxy S25',
    slug: 'samsung-galaxy-s25',
    specs: { RAM: '12 GB' },
    images: [{ url: 'https://example.com/s25.jpg', alt: null }],
    brand: { id: 'b1', name: 'Samsung', slug: 'samsung' },
    category: { id: 'c1', name: 'Smartphones', slug: 'smartphones' },
    variants: [{ id: 'v1', sku: 'S25-256', attributes: { color: 'Black' } }],
  };
}

describe('CatalogService', () => {
  let svc: CatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    svc = TestBed.inject(CatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getProducts maps items/total and filters by category', () => {
    let result: { items: Product[]; total: number } | undefined;
    svc.getProducts('smartphones').subscribe((r) => (result = r));

    const req = httpMock.expectOne((r) => r.url === `${BASE}/products`);
    expect(req.request.params.get('category')).toBe('smartphones');
    req.flush({ items: [apiProduct()], meta: { page: 1, pageSize: 50, total: 1, pages: 1 } });

    expect(result!.total).toBe(1);
    expect(result!.items[0].brand).toBe('Samsung');
    expect(result!.items[0].category).toBe('smartphones');
    expect(result!.items[0].offers).toEqual([]);
    expect(result!.items[0].variants?.[0].sku).toBe('S25-256');
  });

  it('getProductBySlug maps nested brand', () => {
    let product: Product | undefined;
    svc.getProductBySlug('samsung-galaxy-s25').subscribe((p) => (product = p));
    httpMock.expectOne(`${BASE}/products/samsung-galaxy-s25`).flush(apiProduct());
    expect(product!.brand).toBe('Samsung');
  });

  it('getProductBySlug returns undefined on 404', () => {
    let value: Product | undefined = {} as Product;
    svc.getProductBySlug('nope').subscribe((p) => (value = p));
    httpMock
      .expectOne(`${BASE}/products/nope`)
      .flush({ error: { type: 'not_found', message: 'x' } }, { status: 404, statusText: 'Not Found' });
    expect(value).toBeUndefined();
  });

  it('getCategories maps productCount', () => {
    let cats: Category[] | undefined;
    svc.getCategories().subscribe((c) => (cats = c));
    httpMock.expectOne((r) => r.url === `${BASE}/categories`).flush({
      items: [{ id: 'c1', name: 'Smartphones', slug: 'smartphones', productCount: 3 }],
      meta: { page: 1, pageSize: 100, total: 1, pages: 1 },
    });
    expect(cats![0].productCount).toBe(3);
  });

  it('search returns [] for a blank query without hitting the API', async () => {
    const results = await firstValueFrom(svc.search('   '));
    expect(results).toEqual([]);
  });

  it('getDeals uses mock data (no HTTP)', async () => {
    const deals = await firstValueFrom(svc.getDeals());
    expect(deals.length).toBeGreaterThan(0);
  });
});
