import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'acp-icon-user',
  imports: [],
  templateUrl: './icon-user.component.html',
  styleUrl: './icon-user.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class IconUserComponent {
  size = input('35');
}
