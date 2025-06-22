import {
  Component,
  Inject,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogWrapperConfig } from '../../services';

@Component({
  selector: 'acp-dialog-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    CdkDragHandle,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogWrapperComponent implements AfterViewInit {
  // A template reference that acts as an anchor for dynamic content.
  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  contentHost!: ViewContainerRef;

  // A reference to the header element for the z-index focus logic.
  @ViewChild('dialogHeader', { static: false }) header?: ElementRef;

  private static lastZIndex = 1000;

  constructor(
    public dialogRef: MatDialogRef<DialogWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public config: DialogWrapperConfig, // Injects the wrapper-specific config
  ) {}

  ngAfterViewInit(): void {
    // Dynamically create the content component after the view is ready.
    this.contentHost.clear();
    const componentRef = this.contentHost.createComponent(
      this.config.component,
    );

    // Pass the provided data directly to the new component's instance.
    // This requires the content component to have an @Input() property named 'data'.
    if (this.config.data && componentRef.instance) {
      (componentRef.instance as any).data = this.config.data;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  bringToFront(): void {
    const pane = this.header?.nativeElement.closest(
      '.cdk-overlay-pane',
    ) as HTMLElement;
    if (pane) {
      pane.style.zIndex = (++DialogWrapperComponent.lastZIndex).toString();
    }
  }
}
