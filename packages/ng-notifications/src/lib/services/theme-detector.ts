import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeDetector {
  private themeSubject = new BehaviorSubject<string>('material-ui-light');
  private readonly platformId = inject(PLATFORM_ID);
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectTheme();
      this.watchThemeChanges();
    }
  }

  private detectTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const isDark =
      document.body.classList.contains('dark-theme') ||
      document.documentElement.classList.contains('dark-theme');
    this.themeSubject.next(isDark ? 'material-ui-dark' : 'material-ui-light');
  }

  private watchThemeChanges(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = new MutationObserver(() => this.detectTheme());
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  getCurrentTheme(): string {
    return this.themeSubject.value;
  }
}
