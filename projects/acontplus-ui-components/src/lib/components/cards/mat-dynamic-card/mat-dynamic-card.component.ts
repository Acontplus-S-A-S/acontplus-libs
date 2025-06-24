import { Component, input, output, booleanAttribute } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'acp-mat-dynamic-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './mat-dynamic-card.component.html',
  styleUrl: './mat-dynamic-card.component.scss',
})
export class MatDynamicCardComponent {
  // Header inputs
  cardTitle = input<string | null>(null);
  cardSubtitle = input<string | null>(null);
  avatarImageUrl = input<string | null>(null);
  isHeaderVisible = input(false, { transform: booleanAttribute });

  // Content inputs
  contentPadding = input<string>('1rem');
  hasDivider = input(false, { transform: booleanAttribute });

  // Action inputs
  areActionsVisible = input(false, { transform: booleanAttribute });
  primaryButtonText = input('Confirm');
  secondaryButtonText = input('Cancel');
  primaryButtonIcon = input<string | null>(null);
  secondaryButtonIcon = input<string | null>(null);
  buttonsPosition = input<'start' | 'end'>('end');

  // Output events
  primaryButtonClicked = output<void>();
  secondaryButtonClicked = output<void>();
  cardClicked = output<Event>();

  // Methods
  handlePrimaryButtonClick(event: Event): void {
    event.stopPropagation();
    this.primaryButtonClicked.emit();
  }

  handleSecondaryButtonClick(event: Event): void {
    event.stopPropagation();
    this.secondaryButtonClicked.emit();
  }

  handleCardClick(event: Event): void {
    this.cardClicked.emit(event);
  }
}
