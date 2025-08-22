import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { EntityId } from '../../../lib/domain/value-objects/entity-id';
import {HttpClientFactory} from "../../../lib/infrastructure/adapters/http-client-factory";
import {API_URLS} from "../../../lib/domain";
import {GetFormDataCustomerMapper} from "../mappers/get-form-data-customer.mapper";

export class HttpCustomerRepository implements CustomerRepository {
  private get http() {
    return HttpClientFactory.getClient(); // siempre toma el último cliente configurado
  }

  private get url(){
    return `${API_URLS.BILLING}/CompanyCustomer`;
  }

  getFormData(): Promise<any> {
    const json = GetFormDataCustomerMapper.toJson();
    return this.http.get(`${this.url}?json=${json}`).then(response=>{
      console.log(response);
      return response;
    })
  }

  getById(id: EntityId): Promise<any> {
      throw new Error('Method not implemented.');
  }
  getAll(): Promise<any[]> {
      throw new Error('Method not implemented.');
  }
  create(entity: any): Promise<void> {
      throw new Error('Method not implemented.');
  }
  update(entity: any): Promise<void> {
      throw new Error('Method not implemented.');
  }

  delete(id: EntityId): Promise<void> {
      throw new Error('Method not implemented.');
  }



}
