// Define las opciones del repositorio
import { CustomerFilterDTO, CustomerSearchDTO } from '../../data';
import { ApiResponse, PagedResult } from '@acontplus/core';

interface CustomerRepositoryOptions {
  entity: any; // Tu entidad interna (Customer)
  id: number;
  createDto: any;
  updateDto: any;
  getDto: any;
  getAllRequest: CustomerFilterDTO;
}

export interface CustomerRepository {
  // Promise-based API returning standardized ApiResponse
  getAll<T>(obj: T): Promise<ApiResponse<PagedResult<any>>>;
  getById(id: number): Promise<ApiResponse<any>>;
  create(dto: any): Promise<ApiResponse<any>>;
  update(dto: any): Promise<ApiResponse<any>>;

  getFormData(): Promise<ApiResponse<any>>;
  checkExistence(identificationNumber: string): Promise<ApiResponse<any>>;
  updateState(id: number): Promise<ApiResponse<any>>;
  search(params: CustomerSearchDTO): Promise<ApiResponse<any>>;
}
