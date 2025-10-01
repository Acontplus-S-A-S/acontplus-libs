import { Route, Routes } from '@angular/router';
import { MenuItemList, menuItems } from './layout/app-layout/menu-items';
import { authGuard } from '@acontplus/ng-auth';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

const itemToRoute = (i: MenuItemList): Route => {
  const route = {} as Route;
  if (i.route) {
    route.path = i.route;
    route.component = i.component;
  }
  if (i.subItems) {
    route.children = i.subItems.map(s => itemToRoute(s));
  }
  return route;
};

export const appRoutes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      ...menuItems.map(i => itemToRoute(i)),
    ],
  },
];
