// src/lib/domain/models/auth.ts

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

export interface RefreshTokenRequest {
  email: string;
  refreshToken: string;
}
