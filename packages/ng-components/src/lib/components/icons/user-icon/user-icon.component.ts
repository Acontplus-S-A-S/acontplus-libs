import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'acp-user-icon',
  imports: [],
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserIconComponent {
  size = input('35');
}
