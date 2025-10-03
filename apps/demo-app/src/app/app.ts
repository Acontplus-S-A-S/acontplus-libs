import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ApplicationService } from './providers';
import { ThemeService } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { AuthStore } from '@acontplus/ng-auth';

@Component({
  imports: [RouterModule, AppLayoutComponent, AuthLayoutComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'demo-app';
  isActive = true;
  private readonly _appService = inject(ApplicationService);
  private readonly themeService = inject(ThemeService);
  private readonly notificationService = inject(NotificationService);
  private readonly authStore = inject(AuthStore);

  // expose readonly signal to template
  readonly isAuthenticated = this.authStore.isAuthenticated;

  ngOnInit() {
    this.notificationService.snackbar.info({ message: 'App initialized' });
    this.notificationService.sweetAlert.info({
      message: 'App initialized',
      config: { timer: 3000, showCancelButton: true },
    });

    this.notificationService.show({ type: 'info', message: 'App initialized via show method' });
  }

  saveSettings() {
    console.log('Settings saved!');
    // Add your save logic here
  }

  discardChanges() {
    console.log('Changes discarded!');
    // Add your discard logic here
  }
}
