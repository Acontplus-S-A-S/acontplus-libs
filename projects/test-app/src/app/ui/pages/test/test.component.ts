import { Component, inject } from '@angular/core';
import { AdvancedDialogService } from '@acontplus-ui-components';
import { TestDialogComponent } from '../../components/test-dialog/test-dialog.component';
import { MatThemeButtonComponent } from '@acontplus-ui-components';

@Component({
  selector: 'app-test',
  imports: [MatThemeButtonComponent, MatThemeButtonComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  private readonly dialogService = inject(AdvancedDialogService);
  /**
   * EXAMPLE 1: Using the wrapper for a consistent look and feel.
   */
  async openFramedDialog(): Promise<void> {
    const dialogRef = await this.dialogService.openInWrapper(
      // 1. Wrapper-specific configuration
      {
        component: TestDialogComponent,
        title: 'Confirm Action',
        icon: 'warning_amber',
        data: { userId: 42, action: 'delete' },
      },
      // 2. Standard MatDialog configuration
      {
        size: 'sm',
        backdropClickClosable: false,
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Framed dialog closed. Result:', result);
      // alert(`Action was ${result ? 'confirmed' : 'cancelled'}.`);
    });
  }

  /**
   * EXAMPLE 2: Using the raw open method for maximum flexibility.
   * This dialog will NOT have the custom draggable header.
   */
  async openRawDialog(): Promise<void> {
    const dialogRef = await this.dialogService.open(TestDialogComponent, {
      // No title/icon here, as there's no wrapper. The component itself must provide everything.
      data: { userId: 99, action: 'archive' },
      size: 'sm',
      isMobileFullScreen: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Raw dialog closed. Result:', result);
      // alert(`Action was ${result ? 'confirmed' : 'cancelled'}.`);
    });
  }
}
