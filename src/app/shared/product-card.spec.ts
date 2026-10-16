import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { Product } from '../core/models/catalog.models';
import { ProductCard } from './product-card';

const PRODUCT: Product = {
  id: 'p',
  title: 'Test Phone 128GB',
  slug: 'test-phone-128gb',
  brand: 'Testify',
  category: 'smartphones',
  specs: {},
  offers: [
    {
      id: 'o1',
      merchant: { id: 'm1', name: 'Amazon', slug: 'amazon' },
      price: 12999,
      currency: 'INR',
      availability: 'in_stock',
      url: '#',
      lastUpdated: '2026-09-16',
    },
  ],
};

describe('ProductCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders title, brand and cheapest price', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', PRODUCT);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Test Phone 128GB');
    expect(text).toContain('Testify');
    expect(text).toContain('12,999');
    expect(text).toContain('Amazon');
  });
});
