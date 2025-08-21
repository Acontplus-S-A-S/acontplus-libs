import {Component, signal} from '@angular/core';
import {from} from "rxjs";
import {getAllCustomerUseCase} from "@acontplus-core";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {MatThemeButtonComponent} from "../../components";

@Component({
  selector: 'ac-customer-add-edit',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent
  ],
  templateUrl: './customer-add-edit.component.html',
  styleUrl: './customer-add-edit.component.scss'
})
export class CustomerAddEditComponent {
  btnText = signal('Guardar')

  ngOnInit() {
    from(getAllCustomerUseCase.execute({})).subscribe(res => {
      console.log(res)
    })
  }

  protected readonly close = close;
}
