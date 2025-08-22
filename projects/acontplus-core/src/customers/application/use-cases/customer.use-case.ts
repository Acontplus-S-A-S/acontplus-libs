import {CustomerRepository} from "../../domain/repositories/customer.repository";

export class CustomerUseCase {
  constructor(private repo: CustomerRepository) {}

  getFormData(){
    return this.repo.getFormData()
  }

}
