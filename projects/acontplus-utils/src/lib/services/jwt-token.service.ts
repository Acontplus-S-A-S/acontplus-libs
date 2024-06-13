import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {

  getToken(): string | null {
    return localStorage.getItem('access_token');
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
    return !expired ? true : false;
  };
}
