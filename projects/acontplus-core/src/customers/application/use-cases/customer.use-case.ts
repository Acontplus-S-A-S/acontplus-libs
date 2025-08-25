import {CustomerRepository} from "../../domain/repositories/customer.repository";

export class CustomerUseCase {
  constructor(private repo: CustomerRepository) {}

  getAll(params:any){
    return this.repo.getAll(params);
  }
  getFormData(){
    return this.repo.getFormData()
  }

  checkExistence(identificationNumber: string){
    return Promise.resolve({
      identificationNumber
    })
  }

  create(params:any){
     return Promise.resolve()
  }

  update(params:any){
    return Promise.resolve()

  }

}
