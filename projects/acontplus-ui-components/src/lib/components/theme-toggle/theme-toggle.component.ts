import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services';
import { MatIconButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'acp-theme-toggle',
  imports: [MatIconButton, MatIcon, AsyncPipe],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  darkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.darkMode$ = this.themeService.isDarkMode$;
  }
  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
