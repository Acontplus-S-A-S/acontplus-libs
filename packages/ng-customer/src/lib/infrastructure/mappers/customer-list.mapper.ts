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
    // Initialize with backend-aligned shape (PageIndex is commonly 1-based server-side)
    const result: any = {
      items: [] as any[],
      pageIndex: 1,
      pageSize: 0,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
      metadata: {} as Record<string, any>,
    };

    // Parse payload (backend sends JSON string in payload)
    const parsed = typeof response?.payload === 'string' ? JSON.parse(response.payload) : response?.payload;
    const dataArray: any[] = Array.isArray(parsed) ? parsed[0] ?? [] : Array.isArray(parsed?.items) ? parsed.items : [];

    // Map each item to UI-friendly fields, preserving source values
    result.items = dataArray.map((item: any, index: number) => ({
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
      sriValidation: item.validacionSri ?? item.validationSri,
      sriValidationName: (item.validationSri ?? item.validacionSri) ? 'SI' : 'NO',
      identificationType: item.tipoIdentificacion,
      status: item.estado,
      statusName: item.estado ? 'Activo' : 'Inactivo',
      isFinalConsumer: item.codTipoIdentificacion === 'CF',
      totalRecords: item.totalRecords ?? item.TotalCount,
    }));

    // Flexible pagination extraction (prefer explicit backend values)
    const pageIndex = response?.PageIndex ?? response?.pageIndex ?? 1;
    const pageSize = response?.PageSize ?? response?.pageSize ?? result.items.length;
    const totalCountFromItem = result.items.length > 0 ? result.items[0].totalRecords : undefined;
    const totalCount = response?.TotalCount ?? response?.totalCount ?? totalCountFromItem ?? result.items.length;
    const metadata = response?.Metadata ?? response?.metadata ?? {};

    result.pageIndex = Number.isFinite(pageIndex) ? pageIndex : 1;
    result.pageSize = Number.isFinite(pageSize) ? pageSize : result.items.length;
    result.totalCount = Number.isFinite(totalCount) ? totalCount : result.items.length;
    result.totalPages = result.pageSize > 0 ? Math.ceil(result.totalCount / result.pageSize) : 0;
    // Backend semantics show HasPreviousPage as PageIndex > 1
    result.hasPreviousPage = result.pageIndex > 1;
    result.hasNextPage = result.pageIndex < result.totalPages;
    result.metadata = metadata;

    return result;
  }
}

