import { CustomerExternalRepository } from '../../domain/repositories/customer-external.repository';
import { IdentificationNumberVo } from 'acontplus-core/src/lib/value-objects/identification-number.vo';

export class CustomerExternalUseCase {
  constructor(private repo: CustomerExternalRepository) {}

  getById(identification: string) {
    const idNumber = new IdentificationNumberVo(identification);
    return this.repo.getById(idNumber);
  }
}
