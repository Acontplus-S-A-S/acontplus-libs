import { Result } from './../../../lib/application/interfaces/repository';

import { CustomerExternalDTO } from '../../application/dtos/customer-external.dto';
import { IdentificationNumberVo } from '../../../lib/domain/value-objects/identification-number.vo';

export interface CustomerExternalRepository {
  getById(id: IdentificationNumberVo): Promise<Result<CustomerExternalDTO>>;
}
