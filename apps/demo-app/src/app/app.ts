import { Component, inject, OnInit, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { ApplicationService } from './providers';
import { ThemeSwitcher } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { AuthStore } from '@acontplus/ng-auth';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'demo-app';
  isActive = true;
  private readonly _appService = inject(ApplicationService);
  private readonly themeService = inject(ThemeSwitcher);
  private readonly notificationService = inject(NotificationService);
  private readonly authStore = inject(AuthStore);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  // expose readonly signal to template
  readonly isAuthenticated = this.authStore.isAuthenticated;

  ngOnInit() {
    // Defer notifications to avoid blocking initial render and only show on browser
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.notificationService.snackbar.info({ message: 'App initialized' });
            // this.notificationService.show({
            //   type: 'warning',
            //   message: 'App initialized',
            //   config: { timer: 3000, showCancelButton: true },
            // });
            this.notificationService.show({
              type: 'info',
              message: 'App initialized via show method',
            });
          });
        }, 100); // Small delay to allow initial render
      });
    }
  }

  saveSettings() {
    // Add your save logic here
  }

  discardChanges() {
    // Add your discard logic here
  }
}
