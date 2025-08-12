import { Component, inject, input } from '@angular/core';
import {
  MatChipEditedEvent,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRow,
} from '@angular/material/chips';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatHint } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'acp-mat-input-chip',
  imports: [MatFormField, MatLabel, MatChipRow, MatIcon, MatHint, MatChipGrid, MatChipInput],
  templateUrl: './mat-input-chip.component.html',
  styleUrl: './mat-input-chip.component.css',
})
export class MatInputChipComponent {
  chips = input.required<string[]>();
  labelText = input.required<string>();
  placelholder = input<string>('');
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.chips().push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(value: string): void {
    const index = this.chips().indexOf(value);

    if (index >= 0) {
      this.chips().splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }
  }

  edit(inputRaw: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(inputRaw);
      return;
    }

    // Edit existing fruit
    const index = this.chips().indexOf(inputRaw);
    if (index >= 0) {
      this.chips()[index] = value.replace(/\s+/g, '');
    }
  }
}
