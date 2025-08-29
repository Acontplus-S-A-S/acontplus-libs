import { Customer } from './customer.entity';

export interface SupplierProps {
  id: number;
  customer: Customer;
  customerTypeId?: number;
  entityTypeId?: number;
  subTaxpayerId?: number;
  creditTimeId?: number;
  cityId?: number;
  address?: string;
  phone?: string;
  email?: string;
  status?: boolean;
  imported?: boolean;
}

export class Supplier {
  public id: number;
  public customer: Customer;
  public customerTypeId?: number;
  public entityTypeId?: number;
  public subTaxpayerId?: number;
  public creditTimeId?: number;
  public cityId?: number;
  public address?: string;
  public phone?: string;
  public email?: string;
  public status: boolean;
  public imported?: boolean;
  public updatedByUserId?: number;
  public updatedAt?: Date;

  constructor(props: SupplierProps) {
    this.id = props.id;
    this.customer = props.customer;
    this.customerTypeId = props.customerTypeId;
    this.entityTypeId = props.entityTypeId;
    this.subTaxpayerId = props.subTaxpayerId;
    this.creditTimeId = props.creditTimeId;
    this.cityId = props.cityId;
    this.address = props.address;
    this.phone = props.phone;
    this.email = props.email;
    this.status = props.status ?? true;
    this.imported = props.imported;
  }

  activate() {
    this.status = true;
  }
  deactivate() {
    this.status = false;
  }
}
