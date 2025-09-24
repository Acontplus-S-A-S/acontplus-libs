import { ApiResponse, IdentificationNumberVo } from '@acontplus/core';
import { CustomerExternal } from '../entities/customer-external.entity';

export interface CustomerExternalRepository {
  getById(id: IdentificationNumberVo): Promise<ApiResponse<CustomerExternal>>;
}
