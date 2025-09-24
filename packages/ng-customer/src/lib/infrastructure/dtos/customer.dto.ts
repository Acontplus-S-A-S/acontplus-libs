export interface CustomerDTO {
  id: number;
  idCard: string;
  businessName: string;
  tradeName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  sriValidated?: boolean | null;
  idTypeId: number;
  isActive: boolean;
  isDeleted: boolean;
}

