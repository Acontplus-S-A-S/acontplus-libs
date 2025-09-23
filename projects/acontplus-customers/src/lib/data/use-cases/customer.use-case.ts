import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CustomerSearchDTO } from '../dtos/customer.dto';

export class CustomerUseCase {
  constructor(private repo: CustomerRepository) {}

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

  search(filter: CustomerSearchDTO) {
    return this.repo.search(filter);
  }
}
