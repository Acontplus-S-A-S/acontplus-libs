import { Component, ViewEncapsulation } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'acp-spinner',
  imports: [MatProgressSpinner],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Spinner {}
