import { Result } from 'projects/acontplus-core/src/lib/repositories/repository';

import { CustomerExternalDTO } from 'acontplus-core/src/customers/application/dtos/customer-external.dto';
import { IdentificationNumberVo } from 'acontplus-core/src/lib/value-objects/identification-number.vo';

export interface CustomerExternalRepository {
  getById(id: IdentificationNumberVo): Promise<Result<CustomerExternalDTO>>;
}
