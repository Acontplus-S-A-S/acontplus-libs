import { ApiResponse, HttpClientFactory, IdentificationNumberVo } from '@acontplus/core';
import { CUSTOMER_API } from '../constants/customer.constants';
import { CustomerExternalRepository } from '../../domain';
export class CustomerExternalHttpRepository implements CustomerExternalRepository {
  private get http() {
    return HttpClientFactory.getClient(); // siempre toma el último cliente configurado
  }

  private get url() {
    return `${CUSTOMER_API.BILLING}/Consultas/`;
  }

  getById(identification: IdentificationNumberVo): Promise<ApiResponse<{ phone: any; email: any; idCard: any; businessName: any; address: any }>> {
    const id = identification.getId();

    let endpoint = '';
    if (identification.isValidRuc()) {
      endpoint = `GetRucSRI?Ruc=${id}`;
    } else if (identification.isValidCedula()) {
      endpoint = `GetCedulaSri?Ruc=${id}`;
    } else {
      throw new Error('Número de identificación inválido para SRI');
    }

    return this.http.get<any>(`${this.url}${endpoint}`).then(response => {
      const idCard = response.numeroRuc ? response.numeroRuc : response.identificacion;
      const businessName = response.razonSocial ? response.razonSocial : response.nombreCompleto;
      return {
        status: response.error ? 'warning' : 'success',
        code: response.error ? 'EXTERNAL_API_ERROR' : 'SUCCESS',
        data: {
          phone: response.telefono,
          email: response.email,
          idCard,
          businessName,
          address: response.direccion,
        },
        message: response.error ?? 'External API call completed',
        timestamp: new Date().toISOString(),
      } as ApiResponse<any>;
    });
  }
}

