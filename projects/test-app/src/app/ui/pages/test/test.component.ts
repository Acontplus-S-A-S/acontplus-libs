import { Component, inject } from '@angular/core';
import { MatThemeButtonComponent } from '@acontplus-ui-components';
import { DialogService } from '@acontplus-ui-components';
import { TestDialogComponent } from '../../components/test-dialog/test-dialog.component';

@Component({
  selector: 'app-test',
  imports: [MatThemeButtonComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  private readonly _dialogService = inject(DialogService);
  openDialog() {
    this._dialogService.open(TestDialogComponent, {
      size: 'md',
      data: { message: 'Hello from TestComponent!' },
      hasBackdrop: true,
      backdropClickClosable: true,
      escapeKeyClosable: true,
      autoFocus: 'dialog',
      role: 'dialog',
    });
  }
}
