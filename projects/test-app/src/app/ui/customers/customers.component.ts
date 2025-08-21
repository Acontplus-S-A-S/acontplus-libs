
import {Component, inject, Injectable} from '@angular/core';
import {getAllCustomerUseCase} from "@acontplus-core";
import {from} from "rxjs";




@Component({
  selector: 'app-customers',
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {

  ngOnInit(){
     from(getAllCustomerUseCase.execute({test: 0})).subscribe(x => {
       console.log(x)
     })
  }
}
