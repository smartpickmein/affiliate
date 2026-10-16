/** Domain models for the price-comparison UI (mock-backed in this phase). */

export type Availability = 'in_stock' | 'out_of_stock' | 'unknown';

export interface Merchant {
  id: string;
  name: string;
  slug: string;
}

export interface Offer {
  id: string;
  merchant: Merchant;
  price: number; // INR
  currency: string; // 'INR'
  availability: Availability;
  url: string;
  lastUpdated: string; // ISO date
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  attributes: Record<string, string | number>;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string; // category slug
  specs: Record<string, string | number>;
  images?: ProductImage[];
  variants?: ProductVariant[];
  // Populated once merchant offers are connected (later phases); empty for now.
  offers?: Offer[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export type DealScore = 'excellent' | 'good' | 'normal' | 'expensive';

export interface Deal {
  id: string;
  product: Product;
  score: DealScore;
}

export interface PricePoint {
  date: string; // ISO date
  price: number;
}

export interface Page<T> {
  items: T[];
  total: number;
}
