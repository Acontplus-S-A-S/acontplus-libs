import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test',
    loadComponent: () =>
      import('./ui/pages/test/test.component').then((m) => m.TestComponent),
  },
];
