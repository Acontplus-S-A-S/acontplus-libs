import { BaseEntity } from '@acontplus-core';

interface User extends BaseEntity {
  name: string;
  email: string;
  role: string;
}
