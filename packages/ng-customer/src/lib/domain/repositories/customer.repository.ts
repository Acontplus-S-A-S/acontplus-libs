// Define las opciones del repositorio
import { CustomerFilterDTO, CustomerSearchDTO } from '../../data';
import { ApiResponse } from '@acontplus/core';
import { Repository } from '@acontplus/ng-core';

interface CustomerRepositoryOptions {
  entity: any; // Tu entidad interna (Customer)
  id: number;
  createDto: any;
  updateDto: any;
  getDto: any;
  getAllRequest: CustomerFilterDTO;
}

interface BaseCustomerRepository
  extends Pick<Repository<CustomerRepositoryOptions>, 'getAll' | 'getById' | 'create' | 'update'> {}

export interface CustomerRepository extends BaseCustomerRepository {
  getFormData(): Promise<ApiResponse<any>>;
  checkExistence(identificationNumber: string): Promise<ApiResponse<any>>;
  updateState(id: number): Promise<ApiResponse<any>>;
  search(params: CustomerSearchDTO): Promise<ApiResponse<any>>;
}
