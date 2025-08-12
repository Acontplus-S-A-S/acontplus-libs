import { Type } from '@angular/core';
import { ProductsComponent } from '../../ui/products/products.component';
import { CustomersComponent } from '../../ui/customers/customers.component';
import { AutocompleteComponent } from '../../ui/autocomplete/autocomplete.component';
import { CardsComponent } from '../../ui/cards/cards.component';
import { TablesComponent } from '../../ui/tables/tables.component';

export interface MenuItemList {
  icon: string;
  label: string;
  route: string;
  subItems?: MenuItemList[];
  component?: Type<unknown>;
}

export const menuItems: MenuItemList[] = [
  { icon: 'products', label: 'Products', route: 'products', component: ProductsComponent },
  { icon: 'people', label: 'Customers', route: 'customers', component: CustomersComponent },
  { icon: 'table', label: 'Tables', route: 'tables', component: TablesComponent },
  { icon: 'card', label: 'Cards', route: 'cards', component: CardsComponent },
  {
    icon: 'search',
    label: 'Autocomplete',
    route: 'autocomplete',
    component: AutocompleteComponent,
  },
];
