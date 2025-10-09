import { Routes } from '@angular/router';
import { authGuard } from '@acontplus/ng-auth';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./layout/auth-layout/auth-layout.routes').then(m => m.routes),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./layout/app-layout/app-layout.routes').then(m => m.routes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
