import { ApiResponse, IdentificationNumberVo } from '@acontplus/core';
import { CustomerExternalDTO } from '../../infrastructure/dtos/customer-external.dto';

export interface CustomerExternalRepository {
  getById(id: IdentificationNumberVo): Promise<ApiResponse<CustomerExternalDTO>>;
}
