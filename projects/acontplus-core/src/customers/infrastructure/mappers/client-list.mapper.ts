import { ClientListDTO } from '../../application/dtos/client.dto';
import { CustomerDTO } from '../../application/dtos/customer.dto';
export class ClientListMapper {
  static toJson(params: any) {
    return JSON.stringify({
      ...params,
      type: 1,
      tipo: 1, // remove after
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
    });
  }

  static fromJson(response: any) {
    const [data] = JSON.parse(response.payload as string);
    const items: ClientListDTO[] = data.map((item: any) => {
      const customer: CustomerDTO = {
        id: 0,
        idCard: item.numeroIdentificacion,
        businessName: item.nombreFiscal,
        tradeName: item.nombreComercial,
        email: item.correo,
        phone: item.telefono,
        address: item.direccion,
        sriValidated: item.validationSri,
        idTypeId: item.idTipoIdentificacion,
        isActive: item.estado === 1,
        isDeleted: item.estado === 0,
      };

      return {
        id: item.idCliente,
        customer,
        status: item.estado,
        address: item.direccion,
        phone: item.telefono,
        email: item.correo,
        finalConsumer: item.consumidorFinal,
      };
    });

    const totalItems = data.length > 0 ? data[0].totalRecords : 0;

    return {
      items,
      meta: {
        totalItems,
        totalPages: 0,
      },
    };
  }
}
