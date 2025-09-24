import { BaseEntity } from '@acontplus-core';

export interface Product extends BaseEntity {
  name: string;
  category: string;
  price: number;
  stock: number;
  availableDate: Date;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  categoryId: number;
  supplierId?: number;
}
