import { Route, Routes } from '@angular/router';
import { MenuItemList, menuItems } from './menu-items';
import { AppLayoutComponent } from './app-layout.component';

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

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
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
