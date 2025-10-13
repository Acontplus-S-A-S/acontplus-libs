import { Component } from '@angular/core';
import { Button, DynamicCard } from '@acontplus/ng-components';

@Component({
  selector: 'app-buttons',
  imports: [Button, DynamicCard],
  templateUrl: './buttons.html',
  styleUrl: './buttons.css',
})
export class Buttons {}
