import { Component, inject } from '@angular/core';
import { MatCustomDialogComponent } from "@acontplus-ui-components";
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-test-dialog',
  imports: [
    MatCustomDialogComponent,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions
  ],
  templateUrl: './test-dialog.component.html',
  styleUrl: './test-dialog.component.scss'
})
export class TestDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<TestDialogComponent>);
  onClose() {
    this._dialogRef.close();
  }
  confirmDialog() {
    throw new Error('Method not implemented.');
  }
  closeDialog() {
    throw new Error('Method not implemented.');
  }

}
