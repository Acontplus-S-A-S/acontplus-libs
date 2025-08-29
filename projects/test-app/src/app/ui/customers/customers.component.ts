import { Component, inject, Injectable, signal } from '@angular/core';
import { clientUseCase, ClientListDTO } from '@acontplus-core';
import { from } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import {
  AdvancedDialogService,
  MatThemeButtonComponent,
  ClientAddEditComponent,
  ClientCardComponent,
} from '@acontplus-ui-components';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-customers',
  imports: [
    MatCardModule,
    MatThemeButtonComponent,
    ClientAddEditComponent,
    MatChipSet,
    MatChip,
    MatButtonModule,
    MatThemeButtonComponent,
    ClientCardComponent,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  private dialogSvc = inject(AdvancedDialogService);

  customers = signal<ClientListDTO[]>([]);

  ngOnInit() {
    from(
      clientUseCase.getAll({
        pageIndex: 1,
        pageSize: 10,
      }),
    ).subscribe(x => {
      this.customers.set(x.data.items);
    });
  }

  openEdit(customer: ClientListDTO) {
    console.log(customer);
    this.dialogSvc.openInWrapper(
      {
        component: ClientAddEditComponent,
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
        component: ClientAddEditComponent,
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
