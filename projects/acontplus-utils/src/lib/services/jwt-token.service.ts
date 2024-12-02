import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { STORAGE_KEY } from '../environments';

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  #storageKey = inject(STORAGE_KEY);

  getToken(): string | null {
    return localStorage.getItem(this.#storageKey);
  }

  isAuthenticated = () => {
    const authToken = this.getToken();
    let expired = false;
    if (authToken !== null) {
      const decodedJwt = jwtDecode(authToken);
      const expiration = Number(decodedJwt.exp);
      const now = new Date();
      const currentTimeUTC = Math.floor(now.getTime() / 1000);
      if (expiration < currentTimeUTC) {
        expired = true;
      }
    } else {
      expired = true;
    }
    return !expired;
  };
}
