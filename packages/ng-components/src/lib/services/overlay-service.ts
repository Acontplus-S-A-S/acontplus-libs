import { Injectable, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Spinner } from '../components/spinner/spinner';
@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private readonly overlay = inject(Overlay);
  private overlayRef!: OverlayRef;

  showSpinner() {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      });

      const spinnerPortal = new ComponentPortal(Spinner);
      this.overlayRef.attach(spinnerPortal);
    }
  }

  hideSpinner() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null!;
    }
  }
}
