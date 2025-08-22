import { CustomerRepository } from '../../domain/repositories/customer.repository';
import {HttpClientFactory} from "../../../lib/infrastructure/adapters/http-client-factory";
import {API_URLS} from "../../../lib/domain";
import {GetFormDataCustomerMapper} from "../mappers/get-form-data-customer.mapper";
import {ListCustomerMapper} from "../mappers/get-all-customer.mapper";
import {PageResult, Result} from "../../../lib/application";

export class HttpCustomerRepository implements CustomerRepository {
  private get http() {
    return HttpClientFactory.getClient(); // siempre toma el último cliente configurado
  }

  private get url(){
    return `${API_URLS.BILLING}/CompanyCustomer/`;
  }

  getFormData()  {
    const json = GetFormDataCustomerMapper.toJson();
    return this.http.get(`${this.url}?json=${json}`).then(response=>{
      return GetFormDataCustomerMapper.fromJson(response);
    })
  }

  getAll<T>(obj: T):  Promise<Result<PageResult<any>>> {
    const json = ListCustomerMapper.toJson(obj);
    return this.http.get(`${this.url}?json=${json}`).then(response=> ListCustomerMapper.fromJson(response));
  }




}
