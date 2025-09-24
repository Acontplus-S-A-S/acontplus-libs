<<<<<<<< HEAD:packages/ng-customer/src/lib/infrastructure/mappers/client-search.mapper.ts
export class ClientSearchMapper {
  static toJson(params: any) {
========
import { CustomerSearch } from '../../application/models/customer-search.model';

export class CompanySearchMapper {
  static toJson(params: CustomerSearch) {
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/infrastructure/mappers/company-search.mapper.ts
    return JSON.stringify({
      textSearch: params.search,
    });
  }

  static fromJson(response: any) {
    let customers: any[] = [];

    if (response && response.code === '1') {
      const results = JSON.parse(response.payload as string) || [];

      customers = results.map((item: any) => ({
        id: item.idCliente,
        identificationTypeId: item.idTipoIdentificacion,
        creditTimeId: item.idTiempoCredito,
        customerId: item.customerId,
        status: item.estado,
        email: item.correo,
        phone: item.telefono,
        address: item.direccion,
        licensePlate: item.placa,
        creditDays: item.diasCredito,
        sriValidation: item.validationSri,
        businessName: item.nombreFiscal,
        tradeName: item.nombreComercial,
        identificationNumber: item.numeroIdentificacion,
        identificationType: item.tipoIdentificacion,
        sriCode: item.codigoSri,
        companyRuc: item.rucEmpresa,
        companyId: item.companyId,
        name: item.nombreFiscal,
      }));
    }

    return customers;
  }
}

