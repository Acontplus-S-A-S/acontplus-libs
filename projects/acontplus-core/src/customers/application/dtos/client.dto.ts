import { CustomerDTO } from './customer.dto';

export interface ClientListDTO {
  id: number;
  customer: CustomerDTO;
  status: number;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  finalConsumer?: boolean | null;
}
