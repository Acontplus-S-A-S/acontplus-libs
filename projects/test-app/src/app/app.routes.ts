import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test',
    loadComponent: () =>
      import('./ui/pages/test/test.component').then((m) => m.TestComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./ui/pages/product/product.component').then(
        (m) => m.ProductComponent
      ),
  },
];
