import { Merchant, Product } from '../models/catalog.models';
import { cheapestOffer, offersByPrice, priceRange } from './pricing';

const M: Merchant = { id: 'm', name: 'Shop', slug: 'shop' };

function product(prices: Array<{ price: number; availability: 'in_stock' | 'out_of_stock' }>): Product {
  return {
    id: 'p',
    title: 'T',
    slug: 't',
    brand: 'B',
    category: 'c',
    specs: {},
    offers: prices.map((o, i) => ({
      id: `o${i}`,
      merchant: M,
      price: o.price,
      currency: 'INR',
      availability: o.availability,
      url: '#',
      lastUpdated: '2026-09-16',
    })),
  };
}

describe('pricing', () => {
  it('cheapestOffer prefers the lowest in-stock offer', () => {
    const p = product([
      { price: 100, availability: 'in_stock' },
      { price: 80, availability: 'out_of_stock' },
      { price: 90, availability: 'in_stock' },
    ]);
    expect(cheapestOffer(p)?.price).toBe(90);
  });

  it('cheapestOffer falls back to any offer when none in stock', () => {
    const p = product([
      { price: 100, availability: 'out_of_stock' },
      { price: 80, availability: 'out_of_stock' },
    ]);
    expect(cheapestOffer(p)?.price).toBe(80);
  });

  it('priceRange returns min and max across offers', () => {
    const p = product([
      { price: 100, availability: 'in_stock' },
      { price: 80, availability: 'in_stock' },
    ]);
    expect(priceRange(p)).toEqual({ min: 80, max: 100 });
  });

  it('offersByPrice sorts cheapest-first without mutating input', () => {
    const p = product([
      { price: 100, availability: 'in_stock' },
      { price: 80, availability: 'in_stock' },
    ]);
    expect(offersByPrice(p).map((o) => o.price)).toEqual([80, 100]);
    expect(p.offers!.map((o) => o.price)).toEqual([100, 80]);
  });
});
