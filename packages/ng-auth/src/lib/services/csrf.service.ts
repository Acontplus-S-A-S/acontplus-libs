// src/lib/services/csrf.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsrfService {
  private http = inject(HttpClient);
  private csrfToken: string | null = null;

  /**
   * Get CSRF token, fetching it if not available
   */
  async getCsrfToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      this.csrfToken = await firstValueFrom(
        this.http
          .get<{ csrfToken: string }>('csrf-token')
          .pipe(map(response => response.csrfToken)),
      );

      return this.csrfToken || '';
    } catch {
      // If CSRF endpoint fails, return empty token
      // Server should handle missing CSRF tokens appropriately
      return '';
    }
  }

  /**
   * Clear stored CSRF token (useful on logout)
   */
  clearCsrfToken(): void {
    this.csrfToken = null;
  }
}
