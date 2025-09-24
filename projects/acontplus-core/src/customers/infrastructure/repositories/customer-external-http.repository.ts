import { CustomerExternalRepository } from '../../domain/repositories/customer-external.repository';
import { IdentificationNumberVo } from '../../../lib/domain/value-objects/identification-number.vo';
import { HttpClientFactory } from '../../../lib/infrastructure';
import { API_ENDPOINTS } from '../../../lib/domain/constants/api-paths';

export class CustomerExternalHttpRepository implements CustomerExternalRepository {
  private get http() {
    return HttpClientFactory.getClient(); // siempre toma el último cliente configurado
  }

  private get url() {
    return `${API_ENDPOINTS.CONSULTAS.V1}/`;
  }

  getById(identification: IdentificationNumberVo) {
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
        data: {
          phone: response.telefono,
          email: response.email,
          idCard,
          businessName,
          address: response.direccion,
        },
        success: response.error ? false : true,
      };
    });
  }
}
