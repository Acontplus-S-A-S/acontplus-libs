import { BaseEntity } from '../../../acontplus-core/src/public-api';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}
