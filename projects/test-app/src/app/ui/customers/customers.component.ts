
import {Component, inject, Injectable} from '@angular/core';
import {customerUseCase} from "@acontplus-core";
import {from} from "rxjs";
import {MatCardModule} from "@angular/material/card";
import {AdvancedDialogService, MatThemeButtonComponent, CustomerAddEditComponent} from "@acontplus-ui-components";





@Component({
  selector: 'app-customers',
  imports: [
    MatCardModule,
    MatThemeButtonComponent
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  private dialogSvc = inject(AdvancedDialogService)

  ngOnInit(){
     from(customerUseCase.getFormData()).subscribe(x => {
       console.log(x)
     })
  }


  openAdd(){
    this.dialogSvc.open( CustomerAddEditComponent, {
      size: 'xxl',
      data: {
      }
    })
  }
}
