import { Component, input } from '@angular/core';

@Component({
  selector: 'acp-icon-user',
  imports: [],
  templateUrl: './icon-user.component.html',
  styleUrl: './icon-user.component.css',
})
export class IconUserComponent {
  size = input('35');
}
