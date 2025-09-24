<<<<<<<< HEAD:packages/ng-customer/src/lib/application/use-cases/client.use-case.ts
import { ClientRepository } from '../../domain/repositories/client.repository';
========
import { CustomerRepository } from '../../domain';
import { CustomerSearch } from '../models/customer-search.model';
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/application/use-cases/customer.use-case.ts

export class ClientUseCase {
  constructor(private repo: ClientRepository) {}

  getAll(params: any) {
    return this.repo.getAll(params);
  }
  getFormData() {
    return this.repo.getFormData();
  }

  getById(id: number) {
    return this.repo.getById(id);
  }

  checkExistence(identificationNumber: string) {
    return this.repo.checkExistence(identificationNumber);
  }

  create(params: any) {
    return this.repo.create(params);
  }

  update(params: any) {
    return this.repo.update(params);
  }

  updateState(id: number) {
    return this.repo.updateState(id);
  }

<<<<<<<< HEAD:packages/ng-customer/src/lib/application/use-cases/client.use-case.ts
  search(filter: any) {
========
  search(filter: CustomerSearch) {
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/application/use-cases/customer.use-case.ts
    return this.repo.search(filter);
  }
}

