import { CustomerFormDataMapper } from '../mappers/customer-form-data.mapper';
import { HttpClientFactory } from '../../../lib/infrastructure';
import { PageResult, Result } from '../../../lib/application';
import { CustomerGetByIdMapper } from '../mappers/customer-get-by-id.mapper';
import { ApiResponse } from '../../../lib/models';
import { CustomerCreateUpdateMapper } from '../mappers/customer-create-update.mapper';
import { API_ENDPOINTS } from '../../../lib/domain/constants/api-paths';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { ClientListMapper } from '../mappers/client-list.mapper';
import { ClientSearchMapper } from '../mappers/client-search.mapper';

export class ClientHttpRepository implements ClientRepository {
  private get http() {
    return HttpClientFactory.getClient(); // siempre toma el último cliente configurado
  }

  private get url() {
    return `${API_ENDPOINTS.COMPANY_CUSTOMER.V1}/`;
  }

  checkExistence(identificationNumber: string): Promise<Result<any>> {
    const searchPayload = JSON.stringify({
      textSearch: identificationNumber,
      tipo: 3,
    });
    return this.http.get<any>(`${this.url}?json=${searchPayload}`).then(response => {
      const result = {
        success: false,
        data: null as any,
      };
      if (response.code === '1' && response.payload) {
        const parsedData = JSON.parse(response.payload);
        if (Array.isArray(parsedData) && parsedData.length > 0 && Array.isArray(parsedData[0])) {
          const [customer] = parsedData[0];
          if (customer) {
            result.success = true;
            result.data = customer;
          }
        }
      }
      return result;
    });
  }

  getFormData() {
    const json = CustomerFormDataMapper.toJson();
    return this.http.get(`${this.url}?json=${json}`).then(response => {
      return CustomerFormDataMapper.fromJson(response);
    });
  }

  getAll<T>(obj: T) {
    const json = ClientListMapper.toJson(obj);
    return this.http.get<any>(`${this.url}?json=${json}`).then(response => {
      const data = ClientListMapper.fromJson(response);
      return {
        success: response.code === '1',
        data,
        message: response.message,
      };
    });
  }

  create(dto: any): Promise<Result<any>> {
    return this.http
      .post<ApiResponse>(this.url, { data: CustomerCreateUpdateMapper.toJson(dto.data) })
      .then(response => {
        const data = CustomerCreateUpdateMapper.fromJson(response);
        return {
          success: response.code === '1',
          data,
          message: response.message,
        };
      });
  }
  update(dto: any): Promise<Result<any>> {
    return this.http
      .put<ApiResponse>(`${this.url}${dto.id}`, {
        data: CustomerCreateUpdateMapper.toJson(dto.data),
      })
      .then(response => {
        console.log(response);
        return {
          success: response.code === '1',
          message: response.message,
        };
      });
  }
  updateState(id: number) {
    return this.http.delete<ApiResponse>(`${this.url}${id}`).then(response => {
      return {
        success: response.code === '1',
        message: response.message,
      };
    });
  }
  getById(id: number): Promise<Result<any>> {
    return this.http
      .get<any>(`${this.url}GetId/${id}`)
      .then(response => CustomerGetByIdMapper.fromJson(response));
  }

  search(params: any): Promise<Result<any>> {
    const json = ClientSearchMapper.toJson(params);
    return this.http.get<ApiResponse>(`${this.url}Search?json=${json}`).then(response => {
      const data = ClientSearchMapper.fromJson(response);
      return {
        success: response.code === '1',
        data,
        message: response.message,
      };
    });
  }
}
