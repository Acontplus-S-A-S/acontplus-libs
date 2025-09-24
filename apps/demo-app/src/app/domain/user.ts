import { BaseEntity } from '@acontplus/core';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: string;
}
