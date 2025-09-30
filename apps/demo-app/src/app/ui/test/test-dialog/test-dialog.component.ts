import { Component, inject } from '@angular/core';

import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';

import { MatThemeButtonComponent } from '@acontplus/ng-components';

@Component({
  selector: 'app-test-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
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
