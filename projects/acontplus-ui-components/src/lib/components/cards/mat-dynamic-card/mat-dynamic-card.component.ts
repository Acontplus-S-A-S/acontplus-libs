import { Component, input, output, booleanAttribute } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * A versatile card component that wraps Angular Material's mat-card with additional functionality
 * and customization options. This component provides a consistent card layout with configurable
 * header, content, and action areas.
 * 
 * @example
 * <acp-mat-dynamic-card
 *   [cardTitle]="'Card Title'"
 *   [cardSubtitle]="'Card Subtitle'"
 *   [isHeaderVisible]="true"
 *   [areActionsVisible]="true"
 *   (primaryButtonClicked)="onPrimaryAction()">
 *   Card content goes here
 * </acp-mat-dynamic-card>
 */
@Component({
  selector: 'acp-mat-dynamic-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './mat-dynamic-card.component.html',
  styleUrl: './mat-dynamic-card.component.scss',
})
export class MatDynamicCardComponent {
  // Header inputs
  /**
   * The title text to display in the card header.
   * @default null
   */
  cardTitle = input<string | null>(null);

  /**
   * The subtitle text to display in the card header.
   * @default null
   */
  cardSubtitle = input<string | null>(null);

  /**
   * URL for the avatar image to display in the card header.
   * @default null
   */
  avatarImageUrl = input<string | null>(null);

  /**
   * Whether to show the card header section.
   * @default false
   */
  isHeaderVisible = input(false, { transform: booleanAttribute });

  // Content inputs
  /**
   * CSS padding value for the card content area.
   * @default '1rem'
   */
  contentPadding = input<string>('1rem');

  /**
   * Whether to show a divider between the header and content sections.
   * @default false
   */
  hasDivider = input(false, { transform: booleanAttribute });

  // Action inputs
  /**
   * Whether to show the action buttons section.
   * @default false
   */
  areActionsVisible = input(false, { transform: booleanAttribute });

  /**
   * Text for the primary action button.
   * @default 'Confirm'
   */
  primaryButtonText = input('Confirm');

  /**
   * Text for the secondary action button.
   * @default 'Cancel'
   */
  secondaryButtonText = input('Cancel');

  /**
   * Material icon name for the primary button.
   * @default null
   */
  primaryButtonIcon = input<string | null>(null);

  /**
   * Material icon name for the secondary button.
   * @default null
   */
  secondaryButtonIcon = input<string | null>(null);

  /**
   * Alignment of the action buttons.
   * @default 'end'
   */
  buttonsPosition = input<'start' | 'end'>('end');

  // Output events
  /**
   * Event emitted when the primary button is clicked.
   */
  primaryButtonClicked = output<void>();

  /**
   * Event emitted when the secondary button is clicked.
   */
  secondaryButtonClicked = output<void>();

  /**
   * Event emitted when the card is clicked.
   */
  cardClicked = output<Event>();

  // Methods
  /**
   * Handles the primary button click event.
   * Stops event propagation and emits the primaryButtonClicked event.
   * @param event The click event
   */
  handlePrimaryButtonClick(event: Event): void {
    event.stopPropagation();
    this.primaryButtonClicked.emit();
  }

  /**
   * Handles the secondary button click event.
   * Stops event propagation and emits the secondaryButtonClicked event.
   * @param event The click event
   */
  handleSecondaryButtonClick(event: Event): void {
    event.stopPropagation();
    this.secondaryButtonClicked.emit();
  }

  /**
   * Handles the card click event.
   * Emits the cardClicked event with the original event.
   * @param event The click event
   */
  handleCardClick(event: Event): void {
    this.cardClicked.emit(event);
  }
}
