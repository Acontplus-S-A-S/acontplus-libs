import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-svg-icon',
  imports: [],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.css',
})
export class SvgIconComponent {
  id = input('');
  width = input('40px');
  height = input('40px');
  color = input('#414141');
}
