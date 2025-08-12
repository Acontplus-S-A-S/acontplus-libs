import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApplicationService } from './providers/application.service';
import {
  SnackbarService,
  ThemeService,
} from '@acontplus-ui-components';
import {AppLayoutComponent} from "./layout/app-layout/app-layout.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AppLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-app';

  isActive = true;
  private readonly _appService = inject(ApplicationService);
  private readonly _notification = inject(SnackbarService);
  private readonly themeService = inject(ThemeService);
  // ngOnInit() {
  //   this.themeService.loadMode();
  //   this._notification.warning({
  //     message: 'New message received',
  //     title: 'Notification',
  //   });
  //   this._appService.get().subscribe((app) => {
  //     console.log(app);
  //   });
  // }

  saveSettings() {
    console.log('Settings saved!');
    // Add your save logic here
  }

  discardChanges() {
    console.log('Changes discarded!');
    // Add your discard logic here
  }
}
