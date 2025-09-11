
export class ListCustomerMapper {

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
    const result = {
      items: [] as any[],
      meta: {
        totalItems: 0,
        totalPages: 0,
      },
    };
    const [data] = JSON.parse(response.payload as string); // adjust if not an array of arrays
    result.items = data.map((item: any, index: number) => ({
      index: index + 1,
      id: item.idCliente,
      identificationTypeId: item.idTipoIdentificacion,
      identification: item.numeroIdentificacion,
      businessName: item.nombreFiscal,
      tradeName: item.nombreComercial,
      address: item.direccion,
      phone: item.telefono,
      email: item.correo,
      finalConsumer: item.consumidorFinal,
      sriValidation: item.validacionSri,
      sriValidationName: item.validationSri ? "SI" : "NO",
      identificationType: item.tipoIdentificacion,
      status: item.estado,
      statusName: item.estado ? "Activo" : "Inactivo",
      isFinalConsumer: item.codTipoIdentificacion === "CF",
      totalRecords: item.totalRecords,
    }));
    result.meta.totalItems = result.items.length > 0 ? result.items[0].totalRecords : 0;
    return {
      data: result,
      success: true,
    };
  }
}
