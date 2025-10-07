import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AdvancedDialogService, MatThemeButtonComponent } from '@acontplus/ng-components';
import { CustomerAddEditComponent, CustomerCardComponent } from '@acontplus/ng-customer';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-customers',
  imports: [
    MatCardModule,
    MatThemeButtonComponent,
    CustomerCardComponent,
    MatButtonModule,
    MatThemeButtonComponent,
    CustomerCardComponent,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  private dialogSvc = inject(AdvancedDialogService);

  customers = signal<any[]>([]);

  ngOnInit() {
    // Mock customer data for demo
    this.customers.set([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }

  openEdit(customer: any) {
    console.log(customer);
    this.dialogSvc.openInWrapper(
      {
        component: CustomerAddEditComponent,
        title: 'Editar Cliente',
        icon: 'edit',
        data: customer,
      },
      {
        size: 'xl',
      },
    );
  }

  openAdd() {
    this.dialogSvc.openInWrapper(
      {
        component: CustomerAddEditComponent,
        title: 'Nuevo Cliente',
        icon: 'add',
        data: {},
      },
      {
        size: 'xl',
      },
    );
  }
}
