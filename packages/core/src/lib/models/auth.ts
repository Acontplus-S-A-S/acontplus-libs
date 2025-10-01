// src/lib/models/auth.ts
export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  email: string;
  name: string;
  roles?: string[];
}
