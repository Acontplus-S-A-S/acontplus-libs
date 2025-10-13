import { Injectable, inject } from '@angular/core';
import { LoggingService } from './logging-service';

@Injectable({
  providedIn: 'root',
})
export class TenantInfo {
  private tenantId: string | null = null;
  private logger = inject(LoggingService);

  getTenantId(): string {
    if (!this.tenantId) {
      // Get from localStorage, sessionStorage, or JWT token
      this.tenantId =
        localStorage.getItem('tenantId') ||
        sessionStorage.getItem('tenantId') ||
        this.extractTenantFromToken() ||
        'default-tenant';
    }
    return this.tenantId;
  }

  getCurrentTenant(): string | null {
    return this.tenantId;
  }

  setTenantId(tenantId: string): void {
    this.tenantId = tenantId;
    localStorage.setItem('tenantId', tenantId);
  }

  setTenant(tenantId: string): void {
    this.setTenantId(tenantId);
  }

  handleForbidden(): void {
    this.logger.error('Access forbidden for tenant:', this.tenantId);
    // Redirect to tenant selection or show error message
    // this.router.navigate(['/tenant-access-denied']);
  }

  private extractTenantFromToken(): string | null {
    // Implementation depends on your JWT token structure
    // This is a placeholder
    return null;
  }

  clearTenant(): void {
    this.tenantId = null;
    localStorage.removeItem('tenantId');
    sessionStorage.removeItem('tenantId');
  }
}
