import { Category, Merchant, PricePoint, Product } from '../models/catalog.models';

/**
 * In-memory sample catalog. Phase 6 replaces the CatalogService internals with
 * real HTTP calls; the shapes here match what the API will return.
 */

const AMAZON: Merchant = { id: 'm-amazon', name: 'Amazon', slug: 'amazon' };
const FLIPKART: Merchant = { id: 'm-flipkart', name: 'Flipkart', slug: 'flipkart' };
const CROMA: Merchant = { id: 'm-croma', name: 'Croma', slug: 'croma' };

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c-smartphones', name: 'Smartphones', slug: 'smartphones', productCount: 3 },
  { id: 'c-laptops', name: 'Laptops', slug: 'laptops', productCount: 2 },
  { id: 'c-headphones', name: 'Headphones', slug: 'headphones', productCount: 1 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-galaxy-s25',
    title: 'Samsung Galaxy S25 256GB',
    slug: 'samsung-galaxy-s25-256gb',
    brand: 'Samsung',
    category: 'smartphones',
    specs: { RAM: '12 GB', Storage: '256 GB', Display: '6.2" AMOLED', Battery: '4000 mAh' },
    offers: [
      { id: 'o1', merchant: AMAZON, price: 74999, currency: 'INR', availability: 'in_stock', url: 'https://example.com/a1', lastUpdated: '2026-09-16T09:00:00Z' },
      { id: 'o2', merchant: FLIPKART, price: 73499, currency: 'INR', availability: 'in_stock', url: 'https://example.com/f1', lastUpdated: '2026-09-16T08:30:00Z' },
      { id: 'o3', merchant: CROMA, price: 76990, currency: 'INR', availability: 'out_of_stock', url: 'https://example.com/c1', lastUpdated: '2026-09-15T18:00:00Z' },
    ],
  },
  {
    id: 'p-iphone-16',
    title: 'Apple iPhone 16 128GB',
    slug: 'apple-iphone-16-128gb',
    brand: 'Apple',
    category: 'smartphones',
    specs: { RAM: '8 GB', Storage: '128 GB', Display: '6.1" OLED', Battery: '3561 mAh' },
    offers: [
      { id: 'o4', merchant: AMAZON, price: 79900, currency: 'INR', availability: 'in_stock', url: 'https://example.com/a2', lastUpdated: '2026-09-16T09:10:00Z' },
      { id: 'o5', merchant: FLIPKART, price: 79999, currency: 'INR', availability: 'in_stock', url: 'https://example.com/f2', lastUpdated: '2026-09-16T07:45:00Z' },
    ],
  },
  {
    id: 'p-pixel-9',
    title: 'Google Pixel 9 128GB',
    slug: 'google-pixel-9-128gb',
    brand: 'Google',
    category: 'smartphones',
    specs: { RAM: '12 GB', Storage: '128 GB', Display: '6.3" OLED', Battery: '4700 mAh' },
    offers: [
      { id: 'o6', merchant: FLIPKART, price: 69999, currency: 'INR', availability: 'in_stock', url: 'https://example.com/f3', lastUpdated: '2026-09-16T06:00:00Z' },
      { id: 'o7', merchant: AMAZON, price: 71999, currency: 'INR', availability: 'in_stock', url: 'https://example.com/a3', lastUpdated: '2026-09-16T06:20:00Z' },
    ],
  },
  {
    id: 'p-macbook-air',
    title: 'Apple MacBook Air M3 13" 256GB',
    slug: 'apple-macbook-air-m3-13-256gb',
    brand: 'Apple',
    category: 'laptops',
    specs: { CPU: 'Apple M3', RAM: '8 GB', Storage: '256 GB SSD', Display: '13.6" Retina' },
    offers: [
      { id: 'o8', merchant: AMAZON, price: 99990, currency: 'INR', availability: 'in_stock', url: 'https://example.com/a4', lastUpdated: '2026-09-16T05:00:00Z' },
      { id: 'o9', merchant: CROMA, price: 102990, currency: 'INR', availability: 'in_stock', url: 'https://example.com/c2', lastUpdated: '2026-09-15T21:00:00Z' },
    ],
  },
  {
    id: 'p-thinkpad',
    title: 'Lenovo ThinkPad E14 16GB 512GB',
    slug: 'lenovo-thinkpad-e14-16gb-512gb',
    brand: 'Lenovo',
    category: 'laptops',
    specs: { CPU: 'Intel Core i5', RAM: '16 GB', Storage: '512 GB SSD', Display: '14" FHD' },
    offers: [
      { id: 'o10', merchant: FLIPKART, price: 58990, currency: 'INR', availability: 'in_stock', url: 'https://example.com/f4', lastUpdated: '2026-09-16T04:00:00Z' },
      { id: 'o11', merchant: AMAZON, price: 57499, currency: 'INR', availability: 'in_stock', url: 'https://example.com/a5', lastUpdated: '2026-09-16T04:15:00Z' },
    ],
  },
  {
    id: 'p-sony-xm5',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5',
    brand: 'Sony',
    category: 'headphones',
    specs: { Type: 'Over-ear', Battery: '30 h', Connectivity: 'Bluetooth 5.2', ANC: 'Yes' },
    offers: [
      { id: 'o12', merchant: AMAZON, price: 26990, currency: 'INR', availability: 'in_stock', url: 'https://example.com/a6', lastUpdated: '2026-09-16T03:00:00Z' },
      { id: 'o13', merchant: FLIPKART, price: 27499, currency: 'INR', availability: 'in_stock', url: 'https://example.com/f5', lastUpdated: '2026-09-16T03:30:00Z' },
    ],
  },
];

/** Deterministic 8-point price history per product slug (oldest -> newest). */
export const MOCK_PRICE_HISTORY: Record<string, PricePoint[]> = {
  'samsung-galaxy-s25-256gb': points([79999, 78999, 77499, 76990, 75999, 74999, 74499, 73499]),
  'apple-iphone-16-128gb': points([82900, 82900, 81900, 80900, 80900, 79999, 79900, 79900]),
  'google-pixel-9-128gb': points([75999, 74999, 73999, 72999, 71999, 70999, 70499, 69999]),
  'apple-macbook-air-m3-13-256gb': points([114900, 112900, 109900, 106990, 104990, 102990, 100990, 99990]),
  'lenovo-thinkpad-e14-16gb-512gb': points([64990, 63990, 62490, 60990, 59990, 58990, 57990, 57499]),
  'sony-wh-1000xm5': points([29990, 29490, 28990, 28490, 27990, 27499, 27199, 26990]),
};

function points(prices: number[]): PricePoint[] {
  // Weekly points ending "today" (2026-09-16).
  const end = new Date('2026-09-16T00:00:00Z').getTime();
  const week = 7 * 24 * 3600 * 1000;
  return prices.map((price, i) => ({
    date: new Date(end - (prices.length - 1 - i) * week).toISOString().slice(0, 10),
    price,
  }));
}
