import { ApiResponse, IdentificationNumberVo } from '@acontplus/core';
import { CustomerExternalDTO } from '../../data';

export interface CustomerExternalRepository {
  getById(id: IdentificationNumberVo): Promise<ApiResponse<CustomerExternalDTO>>;
}
