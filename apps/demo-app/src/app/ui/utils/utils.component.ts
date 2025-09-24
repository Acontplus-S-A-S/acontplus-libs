import { Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DecimalDemoComponent } from './decimal-demo/decimal-demo.component';
@Component({
  selector: 'app-utils',
  imports: [DecimalDemoComponent],
  templateUrl: './utils.component.html',
  styleUrl: './utils.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class UtilsComponent {}
