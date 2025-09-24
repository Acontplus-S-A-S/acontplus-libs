export interface CustomerListItemDto {
  index: number;
  id: number;
  identificationTypeId: number;
  idCard: string;
  businessName: string;
  tradeName: string;
  address: string;
  phone: string;
  email: string;
  finalConsumer: boolean;
  sriValidation: boolean;
  sriValidationName: 'SI' | 'NO';
  identificationType: string;
  isActive: boolean;
  statusName: 'Activo' | 'Inactivo';
  isFinalConsumer: boolean;
  totalRecords: number;
}

export interface CustomerCreateDTO {
  name: string;
  email: string;
}

export interface CustomerUpdateDTO {
  name?: string;
  email?: string;
}

export interface CustomerFilterDTO {
  search?: string;
  limit?: number;
}

export interface CustomerSearchDTO {
  /** Texto de búsqueda libre (nombre, identificación, comercio, etc.) */
  search?: string;

  /** Número de resultados por página */
  pageSize?: number;

  /** Índice de página (0-based) */
  pageIndex?: number;
}

