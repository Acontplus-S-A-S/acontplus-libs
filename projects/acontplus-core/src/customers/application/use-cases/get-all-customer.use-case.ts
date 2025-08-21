import { IBaseUseCase } from '../../../lib/application/use-cases/base.use-case';
import { CustomerRepository } from '../../domain/repositories/customer.repository';


export class GetAllCustomerUseCase extends IBaseUseCase<any, any> {
  constructor(private customerRepository: CustomerRepository) {
    super()
  }

  execute(request: any) {
    return this.customerRepository.findAll(request);
  }
}
