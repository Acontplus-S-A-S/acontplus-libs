
import {Component, inject, Injectable} from '@angular/core';
import {getAllCustomerUseCase} from "@acontplus-core";




@Component({
  selector: 'app-customers',
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {

  ngOnInit(){
     getAllCustomerUseCase.execute({test: 0}).then(response=>{
       console.log(response);
     })
  }
}
