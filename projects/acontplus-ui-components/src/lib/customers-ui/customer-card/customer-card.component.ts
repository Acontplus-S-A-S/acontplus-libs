import {Component, computed, input, output} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import { MatChipsModule} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {CustomerListItemDto} from "@acontplus-core";
import { MatButtonModule} from "@angular/material/button";
import {MatThemeButtonComponent} from "../../components";

@Component({
  selector: 'acp-customer-card',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatIcon,
    MatButtonModule,
    MatThemeButtonComponent
  ],
  templateUrl: './customer-card.component.html',
  styleUrl: './customer-card.component.scss'
})
export class CustomerCardComponent {
  customer = input.required<CustomerListItemDto>()
  editCustomer = output<CustomerListItemDto>();
  deleteCustomer = output<CustomerListItemDto>();

  getLogoSliceBusinessName = computed(() => {
    const name = this.customer()?.businessName || '';
    return name.slice(0, 1);
  })


  onEditClick(): void {
    // Emits the customer object to the parent component
    this.editCustomer.emit(this.customer());
    console.log('Edit clicked for customer:', this.customer().id);
  }

  onDeleteClick(): void {
    // Emits the customer object to the parent component
    this.deleteCustomer.emit(this.customer());
    console.log('Delete clicked for customer:', this.customer().id);
  }
}
