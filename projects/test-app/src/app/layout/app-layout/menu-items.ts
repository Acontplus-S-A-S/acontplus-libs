import { Type } from '@angular/core';
import { CustomersComponent } from '../../ui/customers/customers.component';
import { AutocompleteComponent } from '../../ui/autocomplete/autocomplete.component';
import { CardsComponent } from '../../ui/cards/cards.component';
import { TablesComponent } from '../../ui/tables/tables.component';
import { UtilsComponent } from '../../ui/utils/utils.component';
import { PricingDemoComponent } from '../../ui/pricing-demo/pricing-demo.component';
import { ProductComponent } from '../../ui/pages/product/product.component';

export interface MenuItemList {
  icon: string;
  label: string;
  route: string;
  subItems?: MenuItemList[];
  component?: Type<unknown>;
}

export const menuItems: MenuItemList[] = [
  { icon: 'utils', label: 'Utils', route: 'utils', component: UtilsComponent },
  { icon: 'pricing', label: 'Pricing', route: 'pricing', component: PricingDemoComponent },
  { icon: 'products', label: 'Products', route: 'products', component: ProductComponent },
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
