// src/CustomerModule.ts
import {CustomerRepository} from "./domain/repositories/CustomerRepository";
import {HttpCustomerRepository} from "./infrastructure/repositoriess/http-customer.repository";
import {GetAllCustomerUseCase} from "./application/use-cases/get-all-customer.use-case";
import {HttpPort} from "../lib/application/interfaces/http.port";

export class CustomerModule {
  private customerRepository: CustomerRepository;

  constructor(httpClient: HttpPort) {
    this.customerRepository = new HttpCustomerRepository(httpClient);
  }

  getAllCustomerUseCase(): GetAllCustomerUseCase {
    return new GetAllCustomerUseCase(this.customerRepository);
  }
}
