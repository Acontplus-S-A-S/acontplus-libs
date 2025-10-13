import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'acp-user-icon',
  imports: [],
  templateUrl: './user-icon.html',
  styleUrl: './user-icon.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserIcon {
  size = input('35');
}
