import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services';
import { MatIconButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'acp-theme-toggle',
  imports: [MatIconButton, MatIcon, AsyncPipe],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  darkMode$: Observable<boolean>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.darkMode$ = this.themeService.isDarkMode$;
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
