import { Component, inject, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  darkMode$: Observable<boolean>;

  constructor() {
    this.darkMode$ = this.themeService.isDarkMode$;
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
