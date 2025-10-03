import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Service to manage URL redirection after authentication
 * Stores the intended URL when session is lost and redirects to it after successful login
 * SSR-compatible by checking platform before accessing sessionStorage
 */
@Injectable({
  providedIn: 'root',
})
export class UrlRedirectService {
  private readonly REDIRECT_URL_KEY = 'acp_redirect_url';
  private readonly EXCLUDED_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  /**
   * Stores the current URL for later redirection
   * @param url - The URL to store (defaults to current URL)
   */
  storeIntendedUrl(url?: string): void {
    // Only store in browser environment
    if (!this.isBrowser()) {
      return;
    }

    const urlToStore = url || this.router.url;

    // Don't store authentication-related routes
    if (this.isExcludedRoute(urlToStore)) {
      return;
    }

    // Don't store URLs with query parameters that might contain sensitive data
    const urlWithoutParams = urlToStore.split('?')[0];
    this.getSessionStorage()?.setItem(this.REDIRECT_URL_KEY, urlWithoutParams);
  }

  /**
   * Gets the stored intended URL
   * @returns The stored URL or null if none exists
   */
  getIntendedUrl(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return this.getSessionStorage()?.getItem(this.REDIRECT_URL_KEY) || null;
  }

  /**
   * Redirects to the stored URL and clears it from storage
   * @param defaultRoute - The default route to navigate to if no URL is stored
   */
  redirectToIntendedUrl(defaultRoute: string = '/'): void {
    const intendedUrl = this.getIntendedUrl();

    if (intendedUrl && !this.isExcludedRoute(intendedUrl)) {
      this.clearIntendedUrl();
      this.router.navigateByUrl(intendedUrl);
    } else {
      this.router.navigate([defaultRoute]);
    }
  }

  /**
   * Clears the stored intended URL
   */
  clearIntendedUrl(): void {
    if (!this.isBrowser()) {
      return;
    }
    this.getSessionStorage()?.removeItem(this.REDIRECT_URL_KEY);
  }

  /**
   * Checks if a URL should be excluded from redirection
   * @param url - The URL to check
   * @returns True if the URL should be excluded
   */
  private isExcludedRoute(url: string): boolean {
    return this.EXCLUDED_ROUTES.some(route => url.includes(route));
  }

  /**
   * Stores the current URL if it's not an excluded route
   * Useful for guards and interceptors
   */
  storeCurrentUrlIfAllowed(): void {
    const currentUrl = this.router.url;
    if (!this.isExcludedRoute(currentUrl)) {
      this.storeIntendedUrl(currentUrl);
    }
  }

  /**
   * Checks if we're running in a browser environment
   * @returns True if running in browser, false if SSR
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Safely gets sessionStorage reference
   * @returns sessionStorage object or null if not available
   */
  private getSessionStorage(): Storage | null {
    if (!this.isBrowser()) {
      return null;
    }
    try {
      return this.document.defaultView?.sessionStorage || null;
    } catch {
      // Handle cases where sessionStorage might be disabled
      return null;
    }
  }
}
