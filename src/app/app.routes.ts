import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'AI Price Compare',
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then((m) => m.Search),
    title: 'Search · AI Price Compare',
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list').then((m) => m.ProductList),
    title: 'Products · AI Price Compare',
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./features/products/product-detail').then((m) => m.ProductDetail),
    title: 'Product · AI Price Compare',
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories').then((m) => m.Categories),
    title: 'Categories · AI Price Compare',
  },
  {
    path: 'deals',
    loadComponent: () => import('./features/deals/deals').then((m) => m.Deals),
    title: 'Deals · AI Price Compare',
  },
  {
    path: 'price-history/:slug',
    loadComponent: () =>
      import('./features/price-history/price-history').then((m) => m.PriceHistory),
    title: 'Price history · AI Price Compare',
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin').then((m) => m.Admin),
    title: 'Admin · AI Price Compare',
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    title: 'Page not found · AI Price Compare',
  },
];
