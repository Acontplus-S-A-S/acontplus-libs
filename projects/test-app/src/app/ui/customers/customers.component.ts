
import {Component, inject, Injectable, signal} from '@angular/core';
import {customerUseCase, CustomerListItemDto} from "@acontplus-core";
import {from} from "rxjs";
import {MatCardModule} from "@angular/material/card";
import {AdvancedDialogService, MatThemeButtonComponent, CustomerAddEditComponent, CustomerCardComponent} from "@acontplus-ui-components";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";





@Component({
  selector: 'app-customers',
  imports: [
    MatCardModule,
    MatThemeButtonComponent,
    CustomerCardComponent,
    MatChipSet,
    MatChip,
    MatButtonModule,
    MatThemeButtonComponent,
    CustomerCardComponent
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  private dialogSvc = inject(AdvancedDialogService)

  customers = signal<CustomerListItemDto[]>([])

  ngOnInit(){
     from(customerUseCase.getAll({
       pageIndex: 1,
       pageSize: 10,
     })).subscribe(x => {
       console.log(x)
       this.customers.set(x?.data?.items || [])
     })
  }


  openAdd(){
    this.dialogSvc.openInWrapper({
      component: CustomerAddEditComponent,
      title: 'Nuevo Cliente',
      icon: 'add',
    }, {
      data: {},
      size: 'xl',

    })
  }
}
