import { CustomerFormDataMapper } from '../mappers/customer-form-data.mapper';
import { ListCustomerMapper } from '../mappers/customer-list.mapper';
import { CustomerRepository } from '../../domain';
import { CustomerGetByIdMapper } from '../mappers/customer-get-by-id.mapper';
import { CustomerCreateUpdateMapper } from '../mappers/customer-create-update.mapper';
import { CustomerSearch } from '../../application/models/customer-search';
import { CompanySearchMapper } from '../mappers/company-search.mapper';
import { ApiResponse, HttpClientFactory, PagedResult } from '@acontplus/core';
import { CUSTOMER_API } from '../constants/customer.constants';

export class CustomerHttpRepository implements CustomerRepository {
  private get http() {
    return HttpClientFactory.getClient(); // siempre toma el último cliente configurado
  }

  private get url() {
    return `${CUSTOMER_API.BILLING}/CompanyCustomer/`;
  }

  checkExistence(identificationNumber: string): Promise<ApiResponse<any>> {
    const searchPayload = JSON.stringify({
      textSearch: identificationNumber,
      tipo: 3,
    });
    return this.http.get<any>(`${this.url}?json=${searchPayload}`).then(response => {
      const result: ApiResponse<any> = {
        status: 'warning',
        code: response.code ?? 'UNKNOWN_ERROR',
        data: null as any,
        message: response.message ?? 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
      if (response.code === '1' && response.payload) {
        const parsedData = JSON.parse(response.payload);
        if (Array.isArray(parsedData) && parsedData.length > 0 && Array.isArray(parsedData[0])) {
          const [customer] = parsedData[0];
          if (customer) {
            result.status = 'success';
            result.data = customer;
          }
        }
      }
      return result;
    });
  }

  getFormData(): Promise<ApiResponse<any>> {
    const json = CustomerFormDataMapper.toJson();
    return this.http.get<any>(`${this.url}?json=${json}`).then((response: any) => {
      const data = CustomerFormDataMapper.fromJson(response);
      return {
        status: 'success',
        code: response.code ?? 'SUCCESS',
        data,
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    });
  }

  getAll<T>(obj: T): Promise<ApiResponse<PagedResult<any>>> {
    const json = ListCustomerMapper.toJson(obj);
    return this.http
      .get<any>(`${this.url}?json=${json}`)
      .then((response: any) => {
        const data = ListCustomerMapper.fromJson(response);
        return {
          status: 'success',
          code: response.code ?? 'SUCCESS',
          data,
          timestamp: new Date().toISOString(),
        } as ApiResponse<PagedResult<any>>;
      });
  }

  create(dto: any): Promise<ApiResponse<any>> {
    return this.http
      .post<ApiResponse>(this.url, { data: CustomerCreateUpdateMapper.toJson(dto.data) })
      .then(response => {
        console.log(response);
        const data = CustomerCreateUpdateMapper.fromJson(response);
        return {
          status: response.code === '1' ? 'success' : 'warning',
          code: response.code ?? 'OPERATION_FAILED',
          data,
          message: response.message ?? 'Operation completed with issues',
          timestamp: new Date().toISOString(),
        } as ApiResponse<any>;
      });
  }
  update(dto: any): Promise<ApiResponse<any>> {
    return this.http
      .put<ApiResponse>(`${this.url}${dto.id}`, {
        data: CustomerCreateUpdateMapper.toJson(dto.data),
      })
      .then(response => {
        console.log(response);
        return {
          status: response.code === '1' ? 'success' : 'warning',
          code: response.code ?? 'OPERATION_FAILED',
          message: response.message ?? 'Operation completed with issues',
          timestamp: new Date().toISOString(),
        } as ApiResponse<any>;
      });
  }
  updateState(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse>(`${this.url}${id}`).then(response => {
      return {
        status: response.code === '1' ? 'success' : 'warning',
        code: response.code,
        message: response.message,
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    });
  }
  getById(id: number): Promise<ApiResponse<any>> {
    return this.http
      .get<any>(`${this.url}GetId/${id}`)
      .then(response => {
        const data = CustomerGetByIdMapper.fromJson(response);
        return {
          status: response.code === '1' ? 'success' : 'warning',
          code: response.code ?? 'OPERATION_FAILED',
          data,
          message: response.message ?? 'Operation completed with issues',
          timestamp: new Date().toISOString(),
        } as ApiResponse<any>;
      });
  }

  search(params: CustomerSearch): Promise<ApiResponse<any>> {
    const json = CompanySearchMapper.toJson(params);
    return this.http.get<ApiResponse>(`${this.url}Search?json=${json}`).then(response => {
      const data = CompanySearchMapper.fromJson(response);
      return {
        status: response.code === '1' ? 'success' : 'warning',
        code: response.code,
        data,
        message: response.message,
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    });
  }
}

