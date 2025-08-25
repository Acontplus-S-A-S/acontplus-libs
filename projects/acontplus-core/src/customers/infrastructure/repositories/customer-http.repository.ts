
import {CustomerFormDataMapper} from "../mappers/customer-form-data.mapper";
import {ListCustomerMapper} from "../mappers/customer-list.mapper";
import {CustomerRepository} from "../../domain/repositories/customer.repository";
import {HttpClientFactory} from "../../../lib/infrastructure";
import {API_URLS} from "../../../lib/domain";
import {PageResult, Result} from "../../../lib/application";

export class CustomerHttpRepository implements CustomerRepository {
  private get http() {
    return HttpClientFactory.getClient(); // siempre toma el último cliente configurado
  }

  private get url(){
    return `${API_URLS.BILLING}/CompanyCustomer/`;
  }

  getFormData()  {
    const json = CustomerFormDataMapper.toJson();
    return this.http.get(`${this.url}?json=${json}`).then(response=>{
      return CustomerFormDataMapper.fromJson(response);
    })
  }

  getAll<T>(obj: T):  Promise<Result<PageResult<any>>> {
    const json = ListCustomerMapper.toJson(obj);
    return this.http.get(`${this.url}?json=${json}`).then(response=> ListCustomerMapper.fromJson(response));
  }




}
