import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatThemeButtonComponent } from '../mat-theme-button';
import { MatIconButton } from '@angular/material/button';

export interface MatCustomDialogOptions {
  showButtonClose?: boolean | true | false;
}

@Component({
  selector: 'acp-mat-custom-dialog',
  imports: [
    MatIcon,
    MatDialogContent,
    MatProgressSpinner,
    MatDialogTitle,
    CdkDrag,
    CdkDragHandle,
    MatDialogActions,
    MatThemeButtonComponent,
    MatIconButton,
  ],
  templateUrl: './mat-custom-dialog.component.html',
  styleUrl: './mat-custom-dialog.component.css',
})
export class MatCustomDialogComponent {
  showHeader = input(true);
  loading = input(false);
  align = input<'start' | 'center' | 'end'>('end');
  title = input('');
  icon = input('');
  options = input<MatCustomDialogOptions>({
    showButtonClose: true,
  });
  close = output();

  @ViewChild('dialogHeader', { static: true }) header!: ElementRef;

  private static lastZIndex = 1000;

  toTop() {
    const pane = this.header.nativeElement.closest(
      '.cdk-overlay-pane',
    ) as HTMLElement;
    if (pane) {
      pane.style.zIndex = (++MatCustomDialogComponent.lastZIndex).toString();
    }
  }
}
