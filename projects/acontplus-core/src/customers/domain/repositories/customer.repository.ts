import {Repository, Result} from "../../../lib/application";
import {
  CustomerCreateDTO, CustomerFilterDTO,
  CustomerListItemDto,
  CustomerUpdateDTO
} from "../../application/dtos/customer.dto";
import {EntityIdVo} from "../../../lib/domain";


interface BaseCustomerRepository extends Pick<Repository<CustomerListItemDto, EntityIdVo, CustomerCreateDTO, CustomerUpdateDTO, CustomerFilterDTO>, 'getAll'> {}


export interface CustomerRepository extends BaseCustomerRepository {
  getFormData(): Promise<Result<any>>;
}
