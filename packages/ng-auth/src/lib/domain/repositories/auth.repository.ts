// src/lib/domain/repositories/auth.repository.ts
import { Observable } from 'rxjs';
import { User, LoginRequest, RegisterRequest, RefreshTokenRequest } from '../models/user';
import { AuthTokens } from '@acontplus/core';

export abstract class AuthRepository {
  abstract login(request: LoginRequest): Observable<AuthTokens>;
  abstract register(request: RegisterRequest): Observable<AuthTokens>;
  abstract refreshToken(request: RefreshTokenRequest): Observable<AuthTokens>;
  abstract logout(email: string, refreshToken: string): Observable<void>;
}
