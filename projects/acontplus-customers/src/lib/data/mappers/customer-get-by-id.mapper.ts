import { SEPARADORES_REGEX } from '../../../lib/domain';
import { parseJSONSafe } from 'acontplus-core/src/lib/utils/json.util';

export class CustomerGetByIdMapper {
  static fromJson(response: any) {
    if (response.code !== '1' || !response.payload) {
      return {} as any;
    }

    const data = JSON.parse(response.payload)[0];

    return {
      idCliente: data.idCliente,
      idTipoClienteProveedor: data.idTipoClienteProveedor,
      idTipoEntidad: data.idTipoEntidad,
      idSubContribuyente: data.idSubContribuyente,
      idTiempoCredito: data.idTiempoCredito,
      idTipoIdentificacion: data.idTipoIdentificacion,
      idCiudad: data.idCiudad,
      numeroIdentificacion: data.numeroIdentificacion,
      identificacionComprador: data.numeroIdentificacion,
      razonSocialComprador: data.nombreFiscal,
      nombreFiscal: data.nombreFiscal,
      montoCredito: data.montoCredito,
      nombreComercial: data.nombreComercial,
      direccion: data.direccion,
      telefono: data.telefono,
      correo: data.correo,
      estado: data.estado,
      idEmpleado: data.idEmpleado,
      diasCredito: data.diasCredito,
      empleado: data.empleado,
      idEmpresa: data.idEmpresa,
      idCargo: data.idCargo,
      placa: data.placa,
      validationSri: data.validationSri,
      codigoSri: data.codigoSri,
      correos: data.correo ? data.correo.split(SEPARADORES_REGEX) : [],
      telefonos: data.telefono ? data.telefono.split(SEPARADORES_REGEX) : [],
      placas: data.placa ? data.placa.split(SEPARADORES_REGEX) : [],
      idFormaPagoSri: data.idFormaPagoSri,
      dataInfoCred: parseJSONSafe(data.infoCrediticia, {}),
      nota: data.nota?.trim() ?? '',
      configValorBruto: data.configValorBruto ?? false,
    };
  }
}
