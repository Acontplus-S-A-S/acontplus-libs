import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApplicationService } from './application.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-app';

  private readonly _appService = inject(ApplicationService);
  ngOnInit() {
    this._appService.get().subscribe((app) => {
      console.log(app);
    });
  }
}
