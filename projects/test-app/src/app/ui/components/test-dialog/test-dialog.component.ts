import { Component, inject } from '@angular/core';
import { DialogWrapperComponent } from '@acontplus-ui-components';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatThemeButtonComponent } from '@acontplus-ui-components';

@Component({
  selector: 'app-test-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    DialogWrapperComponent,
    MatThemeButtonComponent,
  ],
  templateUrl: './test-dialog.component.html',
  styleUrl: './test-dialog.component.scss',
})
export class TestDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<TestDialogComponent>);
  onClose() {
    this._dialogRef.close();
  }
  confirmDialog() {
    throw new Error('Method not implemented.');
  }
}
