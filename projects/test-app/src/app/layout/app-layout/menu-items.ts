import {Type} from '@angular/core';
import {ProductsComponent} from "../../pages/products/products.component";
import {CustomersComponent} from "../../pages/customers/customers.component";
import {AutocompleteComponent} from "../../pages/autocomplete/autocomplete.component";
import {CardsComponent} from "../../pages/cards/cards.component";
import {TablesComponent} from "../../pages/tables/tables.component";

export type MenuItemList = {
  icon: string
  label:string
  route:string
  subItems?:MenuItemList[]
  component?: Type<unknown>
}


export const menuItems:MenuItemList[]=[
  {icon: 'products', label: 'Products', route: 'products', component: ProductsComponent},
  {icon: 'people', label: 'Customers', route: 'customers', component: CustomersComponent},
  {icon: 'table', label: 'Tables', route: 'tables', component: TablesComponent},
  {icon: 'card', label: 'Cards', route: 'cards', component: CardsComponent},
  {icon: 'search', label: 'Autocomplete', route: 'autocomplete', component: AutocompleteComponent},

]
