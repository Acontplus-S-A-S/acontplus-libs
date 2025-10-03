// src/lib/domain/models/user.ts
import { BaseEntity } from '@acontplus/core';

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

export interface RegisterResponse {
  token: string;
  refreshToken: string;
}

export class User implements BaseEntity {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly displayName: string,
    private _refreshToken?: string,
  ) {}

  get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  updateRefreshToken(token: string): void {
    this._refreshToken = token;
  }

  clearRefreshToken(): void {
    this._refreshToken = undefined;
  }

  static create(email: string, displayName: string, _password: string): User {
    const id = Date.now(); // Generate a numeric ID
    return new User(id, email, displayName);
  }
}
