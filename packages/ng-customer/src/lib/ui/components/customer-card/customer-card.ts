import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Button } from '@acontplus/ng-components';
import { CustomerListItemDto } from '../../../infrastructure/dtos/customer-dto';

@Component({
  selector: 'acp-customer-card',
  imports: [MatCardModule, MatDividerModule, MatChipsModule, MatButtonModule, Button],
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.scss',
})
export class CustomerCard {
  customer = input.required<CustomerListItemDto>();
  editCustomer = output<CustomerListItemDto>();
  deleteCustomer = output<CustomerListItemDto>();

  getLogoSliceBusinessName = computed(() => {
    const name = this.customer()?.businessName || '';
    return name.slice(0, 1);
  });

  onEditClick(): void {
    // Emits the customer object to the parent component
    this.editCustomer.emit(this.customer());
  }

  onDeleteClick(): void {
    // Emits the customer object to the parent component
    this.deleteCustomer.emit(this.customer());
  }
}
