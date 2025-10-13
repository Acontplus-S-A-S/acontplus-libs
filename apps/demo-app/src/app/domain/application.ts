import { BaseEntity } from '@acontplus/core';

export interface Application extends BaseEntity {
  name: string;
  description: string;
  version: string;
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'active'
    | 'inactive'
    | 'maintenance'
    | 'deprecated';
  category: string;
  owner: string;
  environment: 'development' | 'staging' | 'production';
  lastDeployed?: string;
  dependencies: string[];
  tags: string[];
  isPublic: boolean;
  repositoryUrl?: string;
  documentationUrl?: string;
  disableSelection?: boolean;
  rowStyle?: {
    backgroundColor?: string;
    color?: string;
    [key: string]: any;
  };
}

export interface ApplicationFilterParams {
  search?: string;
  role?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  status?: Application['status'];
  environment?: Application['environment'];
  category?: string;
  isPublic?: boolean;
}
