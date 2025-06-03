import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApplicationService } from './application.service';
import { NotificationService } from 'acontplus-utils';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-app';

  private readonly _appService = inject(ApplicationService);
  private readonly _notification = inject(NotificationService);
  ngOnInit() {
    this._notification.show({
      type: 'success',
      message: 'New message received',
      title: 'Notification',
    });
    // this._appService.get().subscribe((app) => {
    //   console.log(app);
    // });
  }
}
