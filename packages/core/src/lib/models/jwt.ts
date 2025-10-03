// src/lib/models/jwt.ts
export interface DecodedToken {
  // Standard JWT claims
  exp: number; // Expiration time
  iat: number; // Issued at
  sub: string; // Subject (user ID)
  iss?: string; // Issuer
  aud?: string; // Audience

  // Custom claims
  email: string;
  name: string;
  displayName?: string;
  roles?: string[];
  permissions?: string[];
  tenantId?: string;
  companyId?: string;
}
