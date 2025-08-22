import {CustomerRepository} from "../../domain/repositories/customer.repository";

export class CustomerUseCase {
  constructor(private repo: CustomerRepository) {}

  getFormData(){
    return this.repo.getFormData()
  }

  create(params:any){
    return this.repo.create(params);
  }

  update(params:any){
   return this.repo.update(params);
  }

}
