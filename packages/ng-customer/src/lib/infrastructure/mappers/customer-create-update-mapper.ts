import { DateFormatter, getValidId, isValidField } from '@acontplus/utils';

export class CustomerCreateUpdateMapper {
  static toJson(param: any) {
    return {
      idCliente: getValidId(param.idCliente as number),
      idEmpleado: getValidId(param.idEmpleado as number),
      idTipoIdentificacion: param.idTipoIdentificacion,
      idTipoClienteProveedor: getValidId(param.idTipoClienteProveedor),
      idTipoEntidad: getValidId(param.idTipoEntidad),
      idCiudad: getValidId(param.idCiudad),
      idSubContribuyente: getValidId(param.idSubContribuyente),
      idTiempoCredito: getValidId(param.idTiempoCredito),
      idEmpresa: getValidId(param.idEmpresa),
      idCargo: getValidId(param.idCargo),
      numeroIdentificacion: param.numeroIdentificacion,
      nombreFiscal: param.nombreFiscal,
      nombreComercial: param.nombreComercial,
      direccion: isValidField(param.direccion),
      telefono: isValidField(param.telefono),
      correo: isValidField(param.correo),
      placa: isValidField(param.placa),
      montoCredito: isValidField(param.montoCredito),
      nota: isValidField(param.nota),
      validationSri: param.validationSri,
      idFormaPagoSri: getValidId(param.idFormaPagoSri),
      estado: param.estado ?? true,
      infoCrediticia: param.dataInfoCred && JSON.stringify(param.dataInfoCred),
      configValorBruto: param.configValorBruto ?? null,
      birthDate: DateFormatter.isValid(param.birthDate)
        ? DateFormatter.toUTCString(param.birthDate)
        : null,
    };
  }

  static fromJson(response: any): any {
    if (!response) return response;
    const result = {
      id: 0,
    };

    if (response.code === '1' && typeof response.payload === 'string') {
      try {
        const parsed = JSON.parse(response.payload);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const { idCliente } = parsed[0];
          result.id = idCliente;
        }
      } catch (error) {
        console.error('Error parsing payload JSON:', error);
      }
    }

    return result;
  }
}
