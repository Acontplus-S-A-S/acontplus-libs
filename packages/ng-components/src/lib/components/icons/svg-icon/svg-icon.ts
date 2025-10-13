import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'acp-svg-icon',
  imports: [],
  templateUrl: './svg-icon.html',
  styleUrl: './svg-icon.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SvgIcon {
  id = input('');
  width = input('40px');
  height = input('40px');
  color = input('#414141');
}
