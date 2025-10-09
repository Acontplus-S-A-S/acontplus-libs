import { Component } from '@angular/core';
import { ButtonComponent, DynamicCardComponent } from '@acontplus/ng-components';

@Component({
  selector: 'app-buttons',
  imports: [ButtonComponent, DynamicCardComponent],
  templateUrl: './buttons.html',
  styleUrl: './buttons.css',
})
export class Buttons {}
