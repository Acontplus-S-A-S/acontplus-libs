// src/lib/models/user-data.ts
export interface UserData {
  // Basic user information
  email: string;
  displayName: string;
  name?: string;

  // Authorization data
  roles?: string[];
  permissions?: string[];

  // Organizational context
  tenantId?: string;
  companyId?: string;

  // Additional profile data
  avatarUrl?: string;
  locale?: string;
  timezone?: string;
}
