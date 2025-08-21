import {CustomerModule, FetchAdapter} from '@acontplus-core';
import { HttpClient } from '@angular/common/http';
import {Component, inject, Injectable} from '@angular/core';
import {AngularHttpClientAdapter} from "@acontplus-core";


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerModule: CustomerModule;
  private http = inject(HttpClient);

  constructor( ) {
    const httpClientAdapter = new FetchAdapter('https://jsonplaceholder.typicode.com/' );
    this.customerModule = new CustomerModule(httpClientAdapter);
  }

  async getAl(customerData: any) {
    const createCustomer = this.customerModule.getAllCustomerUseCase();
    return await createCustomer.execute(customerData);
  }
}


@Component({
  selector: 'app-customers',
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  private customerService = inject(CustomerService);

  ngOnInit(){
     this.customerService.getAl({test: 0}).then(response=>{
       console.log(response);
     })
  }
}
