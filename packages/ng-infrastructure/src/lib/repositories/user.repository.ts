import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserData } from '@acontplus/core';
import { TOKEN_PROVIDER } from '../interfaces/token-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  private readonly tokenProvider = inject(TOKEN_PROVIDER);

  getCurrentUser(): UserData | null {
    const token = this.tokenProvider.getToken();
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
