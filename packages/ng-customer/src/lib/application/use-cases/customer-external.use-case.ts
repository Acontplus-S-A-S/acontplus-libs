import { CustomerExternalRepository } from '../../domain/repositories';
import { IdentificationNumberVo } from '@acontplus/core';

export class CustomerExternalUseCase {
  constructor(private repo: CustomerExternalRepository) {}

  getById(identification: string) {
    const idNumber = new IdentificationNumberVo(identification);
    return this.repo.getById(idNumber);
  }
}

