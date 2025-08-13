import { Component } from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ArrayUtilsDemoComponent} from "./array-utils-demo/array-utils-demo.component";
import {DateUtilsDemoComponent} from "./date-utils-demo/date-utils-demo.component";
import {NumberUtilsDemoComponent} from "./number-utils-demo/number-utils-demo.component";
import {DecimaldemoComponent} from "./decimaldemo/decimaldemo.component";
@Component({
  selector: 'app-utils',
  imports: [
    ArrayUtilsDemoComponent, DateUtilsDemoComponent, NumberUtilsDemoComponent, DecimaldemoComponent],
  templateUrl: './utils.component.html',
  styleUrl: './utils.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class UtilsComponent {


}
