import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicCardComponent, ButtonComponent } from '@acontplus/ng-components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DynamicCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {}
