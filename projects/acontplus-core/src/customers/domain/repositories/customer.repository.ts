import { Repository, Result } from '../../../lib/application';
import { CustomerFilterDTO, CustomerSearchDTO } from '../../application/dtos/customer.dto';
import { EntityIdVo } from '../../../lib/domain';

// Define las opciones del repositorio
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
  getFormData(): Promise<Result<any>>;
  checkExistence(identificationNumber: string): Promise<Result<any>>;
  updateState(id: number): Promise<Result<any>>;
  search(params: CustomerSearchDTO): Promise<Result<any>>;
}
