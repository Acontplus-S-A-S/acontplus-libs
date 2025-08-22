
import {Repository, Result} from '../../../lib/application/interfaces/repository';
import { EntityId } from '../../../lib/domain/value-objects/entity-id';
import {
  CustomerCreateDTO,
  CustomerFilterDTO, CustomerListItemDto,
  CustomerUpdateDTO
} from "../../application/dtos/customer.dto";


interface BaseCustomerRepository extends Pick<Repository<CustomerListItemDto, EntityId, CustomerCreateDTO, CustomerUpdateDTO, CustomerFilterDTO>, 'getAll'> {}


export interface CustomerRepository extends BaseCustomerRepository {
  getFormData(): Promise<Result<any>>;
}
