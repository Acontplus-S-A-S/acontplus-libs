// src/lib/value-objects/auth-tokens.vo.ts
import { BaseVo } from './base.vo';

export class AuthTokens extends BaseVo<{ token: string; refreshToken: string }> {
  constructor(token: string, refreshToken: string) {
    super({ token, refreshToken });
  }

  protected validate(value: { token: string; refreshToken: string }) {
    if (!value.token || typeof value.token !== 'string') {
      throw new Error('Token must be a non-empty string');
    }
    if (!value.refreshToken || typeof value.refreshToken !== 'string') {
      throw new Error('Refresh token must be a non-empty string');
    }
  }

  get token(): string {
    return this.value.token;
  }

  get refreshToken(): string {
    return this.value.refreshToken;
  }
}
