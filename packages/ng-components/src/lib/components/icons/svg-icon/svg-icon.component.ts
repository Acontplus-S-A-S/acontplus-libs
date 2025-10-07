import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'acp-svg-icon',
  imports: [],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SvgIconComponent {
  id = input('');
  width = input('40px');
  height = input('40px');
  color = input('#414141');
}
