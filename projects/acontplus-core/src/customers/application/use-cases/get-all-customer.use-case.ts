import { BaseUseCase } from '../../../lib/application/use-cases/base.use-case';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class GetAllCustomerUseCase extends BaseUseCase<any, any> {
  constructor(private customerRepository: CustomerRepository) {
    super();
  }

  execute(request: any) {
    return this.customerRepository.findAll(request);
  }
}
