import { Injectable } from '@angular/core';
import { ITokenProvider } from '@acontplus/ng-infrastructure';
import { TokenRepository } from '../repositories/token.repository';

@Injectable({ providedIn: 'root' })
export class AuthTokenService implements ITokenProvider {
  constructor(private tokenRepository: TokenRepository) {}

  getToken(): string | null {
    return this.tokenRepository.getAccessToken();
  }

  isAuthenticated(): boolean {
    return this.tokenRepository.isAuthenticated();
  }
}
