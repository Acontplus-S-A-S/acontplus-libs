import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ApplicationService } from './providers';
import { ThemeService } from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';

@Component({
  imports: [NxWelcome, RouterModule, AppLayoutComponent],
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

  ngOnInit() {
    this.notificationService.toastr.info({
      message: 'App initialized',
      config: { timeOut: 3000, positionClass: 'toast-top-right' },
    });
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
