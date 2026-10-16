import { Offer, Product } from '../models/catalog.models';

/** The cheapest in-stock offer for a product (falls back to any offer). */
export function cheapestOffer(product: Product): Offer | null {
  const offers = product.offers ?? [];
  const inStock = offers.filter((o) => o.availability !== 'out_of_stock');
  const pool = inStock.length ? inStock : offers;
  if (!pool.length) {
    return null;
  }
  return pool.reduce((min, o) => (o.price < min.price ? o : min));
}

/** Min/max offer price for a product, or null when there are no offers. */
export function priceRange(product: Product): { min: number; max: number } | null {
  const offers = product.offers ?? [];
  if (!offers.length) {
    return null;
  }
  const prices = offers.map((o) => o.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Offers sorted cheapest-first. */
export function offersByPrice(product: Product): Offer[] {
  return [...(product.offers ?? [])].sort((a, b) => a.price - b.price);
}
