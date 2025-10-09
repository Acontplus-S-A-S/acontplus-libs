import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDynamicCardComponent, MatThemeButtonComponent } from '@acontplus/ng-components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatThemeButtonComponent, MatDynamicCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {}
