import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _darkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this._darkMode.asObservable();

  loadMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this._darkMode.next(savedTheme === 'dark');
      this.applyTheme(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._darkMode.next(prefersDark);
      this.applyTheme(prefersDark);
    }
  }

  toggleDarkMode(): void {
    const newValue = !this._darkMode.value;
    this._darkMode.next(newValue);
    this.applyTheme(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
