import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    title: 'Products | Product Catalog',
    loadComponent: () =>
      import('./products/product-list/product-list').then(
        ({ ProductList }) => ProductList,
      ),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
