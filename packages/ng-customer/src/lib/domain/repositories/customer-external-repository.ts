import { ApiResponse, IdentificationNumberVo } from '@acontplus/core';
import { CustomerExternal } from '../models/customer-external';

export interface CustomerExternalRepository {
  getById(id: IdentificationNumberVo): Promise<ApiResponse<CustomerExternal>>;
}
