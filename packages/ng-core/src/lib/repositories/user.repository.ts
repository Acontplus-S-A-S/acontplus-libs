import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserData } from '@acontplus/core';
import { TokenRepository } from './token.repository';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  private readonly tokenRepository = inject(TokenRepository);

  getCurrentUser(): UserData | null {
    const token = this.tokenRepository.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const decodedToken = jwtDecode<Record<string, unknown>>(token);

      const email =
        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
        decodedToken['email'] ??
        decodedToken['sub'] ??
        decodedToken['user_id'];

      const name =
        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ??
        decodedToken['name'] ??
        decodedToken['given_name'] ??
        decodedToken['display_name'];

      if (!email) {
        return null;
      }

      const userData: UserData = {
        email: email.toString(),
        name: name?.toString() ?? 'Unknown User',
      };

      return userData;
    } catch {
      return null;
    }
  }
}
