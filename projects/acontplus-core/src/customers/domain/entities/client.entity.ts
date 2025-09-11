import { Customer } from './customer.entity';

export interface ClientProps {
  id: number;
  customer: Customer;
  customerTypeId?: number;
  entityTypeId?: number;
  subTaxpayerId?: number;
  creditTimeId?: number;
  cityId?: number;
  creditAmount?: number;
  address?: string;
  phone?: string;
  email?: string;
  status?: boolean;
  finalConsumer?: boolean;
  employeeId?: number;
  companyId?: number;
  positionId?: number;
  licensePlate?: string;
  note?: string;
  imported?: boolean;
  paymentMethodSrilId?: number;
  creditInfo?: string;
  grossValueConfig?: boolean;
}

export class Client {
  public id: number;
  public customer: Customer;
  public customerTypeId?: number;
  public entityTypeId?: number;
  public subTaxpayerId?: number;
  public creditTimeId?: number;
  public cityId?: number;
  public creditAmount?: number;
  public address?: string;
  public phone?: string;
  public email?: string;
  public status: boolean;
  public finalConsumer?: boolean;

  public employeeId?: number;
  public companyId?: number;
  public positionId?: number;
  public licensePlate?: string;
  public note?: string;
  public imported?: boolean;
  public paymentMethodSrilId?: number;
  public creditInfo?: string;
  public grossValueConfig?: boolean;

  constructor(props: ClientProps) {
    this.id = props.id;
    this.customer = props.customer;
    this.customerTypeId = props.customerTypeId;
    this.entityTypeId = props.entityTypeId;
    this.subTaxpayerId = props.subTaxpayerId;
    this.creditTimeId = props.creditTimeId;
    this.cityId = props.cityId;
    this.creditAmount = props.creditAmount;
    this.address = props.address;
    this.phone = props.phone;
    this.email = props.email;
    this.status = props.status ?? true;
    this.finalConsumer = props.finalConsumer;
    this.employeeId = props.employeeId;
    this.companyId = props.companyId;
    this.positionId = props.positionId;
    this.licensePlate = props.licensePlate;
    this.note = props.note;
    this.imported = props.imported;
    this.paymentMethodSrilId = props.paymentMethodSrilId;
    this.creditInfo = props.creditInfo;
    this.grossValueConfig = props.grossValueConfig;
  }

  activate() {
    this.status = true;
  }
  deactivate() {
    this.status = false;
  }
}
