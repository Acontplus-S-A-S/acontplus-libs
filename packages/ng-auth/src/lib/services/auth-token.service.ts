import { Injectable, inject } from '@angular/core';
import { ITokenProvider } from '@acontplus/ng-infrastructure';
import { TokenRepository } from '../repositories/token.repository';

@Injectable({ providedIn: 'root' })
export class AuthTokenService implements ITokenProvider {
  private readonly tokenRepository = inject(TokenRepository);

  getToken(): string | null {
    return this.tokenRepository.getAccessToken();
  }

  isAuthenticated(): boolean {
    return this.tokenRepository.isAuthenticated();
  }
}
