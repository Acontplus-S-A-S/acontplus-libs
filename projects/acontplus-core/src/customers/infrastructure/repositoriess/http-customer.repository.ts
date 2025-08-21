import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { EntityId } from '../../../lib/domain/value-objects/entity-id';
import {HttpClientFactory} from "../../../lib/infrastructure/adapters/http-client-factory";

export class HttpCustomerRepository implements CustomerRepository {
  private get http() {
    return HttpClientFactory.getClient(); // siempre toma el último cliente configurado
  }

  delete(id: EntityId): Promise<void> {
        throw new Error('Method not implemented.');
    }

  findAll(params: any): Promise<any[]> {
    return this.http.get<any[]>('/posts', {
      params,
    });
  }

  async findById(id: EntityId): Promise<any | null> {
    try {
      const data = await this.http.get<any>(`/customers/${id.getValue()}`);
      return this.mapToCustomer(data);
    } catch (error) {
      return null;
    }
  }
  async save(customer: any): Promise<void> {
    const data = this.mapFromCustomer(customer);
    await this.http.post('/customers', data);
  }

  private mapToCustomer(data: any): any {
    return {};
  }

  private mapFromCustomer(customer: any): any {
    return {};
  }


}
