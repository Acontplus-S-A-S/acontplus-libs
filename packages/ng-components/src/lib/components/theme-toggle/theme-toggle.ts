import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeSwitcher } from '../../services';
import { MatIconButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'acp-theme-toggle',
  imports: [MatIconButton, MatIcon, AsyncPipe],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ThemeToggle {
  private themeService = inject(ThemeSwitcher);

  darkMode$: Observable<boolean>;

  constructor() {
    this.darkMode$ = this.themeService.isDarkMode$;
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
