export interface CustomerProps {
  id: number;
  idCard: string;
  businessName: string;
  tradeName?: string;
  email?: string;
  phone?: string;
  address?: string;
  sriValidated?: boolean;
  idTypeId?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  birthDate?: Date;
}

export class Customer {
  public id: number;
  public idCard: string;
  public businessName: string;
  public tradeName?: string;
  public email?: string;
  public phone?: string;
  public address?: string;
  public sriValidated?: boolean;
  public idTypeId?: number;
  public isActive: boolean;
  public isDeleted: boolean;
  public birthDate?: Date;

  constructor(props: CustomerProps) {
    this.id = props.id;
    this.idCard = props.idCard;
    this.businessName = props.businessName;
    this.tradeName = props.tradeName;
    this.email = props.email;
    this.phone = props.phone;
    this.address = props.address;
    this.sriValidated = props.sriValidated;

    this.idTypeId = props.idTypeId;
    this.isActive = props.isActive ?? true;
    this.isDeleted = props.isDeleted ?? false;
    this.birthDate = props.birthDate;
  }
}
