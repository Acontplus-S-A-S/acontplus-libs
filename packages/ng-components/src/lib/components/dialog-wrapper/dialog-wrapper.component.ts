import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ElementRef,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';

import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogWrapperConfig } from '../../services';

/**
 * A wrapper component for Angular Material dialogs that provides a consistent look and feel,
 * including a draggable header and the ability to dynamically create components inside the dialog.
 *
 * This component is typically used with the AdvancedDialogService's openInWrapper method.
 *
 * @example
 * // In your service or component:
 * this.dialogService.openInWrapper({
 *   component: YourDialogContentComponent,
 *   title: 'Dialog Title',
 *   icon: 'info',
 *   data: { message: 'This is some data passed to the dialog content component' }
 * });
 */
@Component({
  selector: 'acp-dialog-wrapper',
  standalone: true,
  imports: [CdkDrag, CdkDragHandle, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogWrapperComponent implements AfterViewInit {
  dialogRef = inject<MatDialogRef<DialogWrapperComponent>>(MatDialogRef);
  config = inject<DialogWrapperConfig>(MAT_DIALOG_DATA);

  /**
   * A template reference that acts as an anchor for dynamic content.
   * This is where the component specified in the config will be rendered.
   */
  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  contentHost!: ViewContainerRef;

  /**
   * A reference to the header element for the z-index focus logic.
   * Used to bring the dialog to the front when clicked.
   */
  @ViewChild('dialogHeader', { static: false }) header?: ElementRef;

  /**
   * Static counter to track the highest z-index for multiple dialogs.
   * Ensures that the most recently clicked dialog appears on top.
   */
  private static lastZIndex = 1000;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  /**
   * Creates an instance of DialogWrapperComponent.
   *
   * @param dialogRef Reference to the dialog opened via the Material Dialog service
   * @param config Configuration for the dialog wrapper, injected from MAT_DIALOG_DATA
   */
  constructor() {}

  /**
   * Lifecycle hook that initializes the dynamic content after the view is ready.
   * Creates the component specified in the config and passes data to it.
   */
  ngAfterViewInit(): void {
    // Dynamically create the content component after the view is ready.
    this.contentHost.clear();
    const componentRef = this.contentHost.createComponent(this.config.component);

    // Pass the provided data directly to the new component's instance.
    // This requires the content component to have an @Input() property named 'data'.
    if (this.config.data && componentRef.instance) {
      (componentRef.instance as any).data = this.config.data;
    }
  }

  /**
   * Closes the dialog.
   * Called when the close button in the header is clicked.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Brings the dialog to the front by adjusting its z-index.
   * Called when the dialog header is clicked.
   */
  bringToFront(): void {
    const pane = this.header?.nativeElement.closest('.cdk-overlay-pane') as HTMLElement;
    if (pane) {
      pane.style.zIndex = (++DialogWrapperComponent.lastZIndex).toString();
    }
  }
}
