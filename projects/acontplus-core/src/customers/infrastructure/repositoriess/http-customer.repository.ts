import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import { EntityId } from '../../../lib/domain/value-objects/entity-id';
import {HttpPort} from "../../../lib/application/interfaces/http.port";

export class HttpCustomerRepository implements CustomerRepository {
  constructor(private httpClient: HttpPort) {}

  findAll(params: any): Promise<any[]> {
    return this.httpClient.get<any[]>('/posts', {
      params,
    });
  }

  async findById(id: EntityId): Promise<any | null> {
    try {
      const data = await this.httpClient.get<any>(`/customers/${id.getValue()}`);
      return this.mapToCustomer(data);
    } catch (error) {
      return null;
    }
  }
  async save(customer: any): Promise<void> {
    const data = this.mapFromCustomer(customer);
    await this.httpClient.post('/customers', data);
  }

  private mapToCustomer(data: any): any {
    return {};
  }

  private mapFromCustomer(customer: any): any {
    return {};
  }

  delete(id: EntityId): Promise<void> {
    return Promise.resolve(undefined);
  }
}
