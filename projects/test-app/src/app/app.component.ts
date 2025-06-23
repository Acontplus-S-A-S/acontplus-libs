import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApplicationService } from './application.service';
import {
  IconUserComponent,
  MatThemeButtonComponent,
  SnackbarService,
} from '@acontplus-ui-components';
import { MatDynamicCardComponent } from '@acontplus-ui-components';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { StatusDisplayPipe } from '@acontplus-ui-components';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    IconUserComponent,
    MatDynamicCardComponent,
    MatFormField,
    MatLabel,
    MatSelectModule,
    StatusDisplayPipe,
    StatusDisplayPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-app';

  isActive = true;

  private readonly _appService = inject(ApplicationService);
  private readonly _notification = inject(SnackbarService);
  ngOnInit() {
    this._notification.warning({
      message: 'New message received',
      title: 'Notification',
    });
    // this._appService.get().subscribe((app) => {
    //   console.log(app);
    // });
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
