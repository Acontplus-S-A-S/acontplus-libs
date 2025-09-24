import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ApplicationService } from './providers';
import { ThemeService } from '@acontplus/ng-components';

@Component({
  imports: [NxWelcome, RouterModule, AppLayoutComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'demo-app';
  isActive = true;
  private readonly _appService = inject(ApplicationService);
  private readonly themeService = inject(ThemeService);
  saveSettings() {
    console.log('Settings saved!');
    // Add your save logic here
  }

  discardChanges() {
    console.log('Changes discarded!');
    // Add your discard logic here
  }
}
