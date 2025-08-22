export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface CustomerListItemDto {
  index: number;
  id: number;
  identificationTypeId: number;
  identification: string;
  businessName: string;
  tradeName: string;
  address: string;
  phone: string;
  email: string;
  finalConsumer: boolean;
  sriValidation: boolean;
  sriValidationName: "YES" | "NO";
  identificationType: string;
  status: boolean;
  statusName: "Active" | "Inactive";
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
