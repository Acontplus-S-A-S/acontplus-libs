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

      const displayName =
        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ??
        decodedToken['displayName'] ??
        decodedToken['display_name'] ??
        decodedToken['name'] ??
        decodedToken['given_name'];

      const name = decodedToken['name'] ?? displayName;

      if (!email) {
        return null;
      }

      const userData: UserData = {
        email: email.toString(),
        displayName: displayName?.toString() ?? 'Unknown User',
        name: name?.toString(),
        roles: this.extractArrayField(decodedToken, ['roles', 'role']),
        permissions: this.extractArrayField(decodedToken, ['permissions', 'perms']),
        tenantId:
          decodedToken['tenantId']?.toString() ??
          decodedToken['tenant_id']?.toString() ??
          decodedToken['tenant']?.toString(),
        companyId:
          decodedToken['companyId']?.toString() ??
          decodedToken['company_id']?.toString() ??
          decodedToken['organizationId']?.toString() ??
          decodedToken['org_id']?.toString(),
        locale: decodedToken['locale']?.toString(),
        timezone: decodedToken['timezone']?.toString() ?? decodedToken['tz']?.toString(),
      };

      return userData;
    } catch {
      return null;
    }
  }

  /**
   * Extract array field from decoded token, trying multiple possible field names
   */
  private extractArrayField(
    decodedToken: Record<string, unknown>,
    fieldNames: string[],
  ): string[] | undefined {
    for (const fieldName of fieldNames) {
      const value = decodedToken[fieldName];
      if (Array.isArray(value)) {
        return value.map(v => v.toString());
      }
      if (typeof value === 'string') {
        // Handle comma-separated string values
        return value
          .split(',')
          .map(v => v.trim())
          .filter(v => v.length > 0);
      }
    }
    return undefined;
  }
}
