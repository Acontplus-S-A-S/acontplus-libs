export interface BaseEntity {
  id: number;
  createdAt?: string;
  createdByUserId?: number;
  updatedAt?: string;
  updatedByUserId?: number;
  isActive?: boolean;
}
