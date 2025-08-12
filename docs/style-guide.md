# Acontplus UI Components Style Guide

This document provides guidelines for consistent design and usage of components
in the acontplus-ui-components library. Following these guidelines will ensure a
cohesive user experience across applications that use these components.

## Table of Contents

- [Design Principles](#design-principles)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing](#spacing)
- [Component Guidelines](#component-guidelines)
  - [Cards](#cards)
  - [Dialogs](#dialogs)
  - [Buttons](#buttons)
  - [Forms](#forms)
  - [Tables](#tables)
  - [Navigation](#navigation)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Responsive Design](#responsive-design)
- [Animation Guidelines](#animation-guidelines)

## Design Principles

The design of acontplus-ui-components is guided by the following principles:

1. **Consistency**: Components should look and behave consistently across the
   application.
2. **Simplicity**: Components should be intuitive and easy to use.
3. **Flexibility**: Components should be customizable to meet different needs.
4. **Accessibility**: Components should be accessible to all users, including
   those with disabilities.
5. **Performance**: Components should be optimized for performance.

## Color System

The color system is based on Angular Material's theming system, with primary,
accent, and warn palettes. The default theme includes:

### Primary Palette

The primary palette is used for primary actions, key elements, and branding.

```scss
$primary-palette: mat.define-palette(mat.$indigo-palette);
```

### Accent Palette

The accent palette is used for secondary actions and highlighting important
elements.

```scss
$accent-palette: mat.define-palette(mat.$pink-palette, A200, A100, A400);
```

### Warn Palette

The warn palette is used for error states and destructive actions.

```scss
$warn-palette: mat.define-palette(mat.$red-palette);
```

### Theme Configuration

Components should use the theme colors consistently:

- Primary color for main actions and key UI elements
- Accent color for secondary actions and highlighting
- Warn color for errors and destructive actions
- Background colors for surfaces and containers
- Text colors for content with appropriate contrast

## Typography

Typography follows the Angular Material typography system, with a hierarchy of
styles for different text elements.

### Font Family

The default font family is Roboto, with fallbacks to system fonts:

```scss
$font-family: 'Roboto, "Helvetica Neue", sans-serif';
```

### Typography Levels

Use the appropriate typography level for each text element:

- **Display**: Large, prominent text (page titles)
- **Headline**: Section headings
- **Title**: Card titles, dialog titles
- **Subheading**: Secondary headings
- **Body**: Main content text
- **Caption**: Small text, labels
- **Button**: Text on buttons

## Spacing

Spacing should be consistent throughout the application, using a base unit of
8px (0.5rem).

### Spacing Scale

- **Extra small**: 4px (0.25rem)
- **Small**: 8px (0.5rem)
- **Medium**: 16px (1rem)
- **Large**: 24px (1.5rem)
- **Extra large**: 32px (2rem)
- **2x Extra large**: 48px (3rem)
- **3x Extra large**: 64px (4rem)

### Spacing Guidelines

- Use consistent spacing between related elements
- Use larger spacing between unrelated elements
- Maintain consistent padding within containers
- Ensure adequate spacing for touch targets (minimum 48px)

## Component Guidelines

### Cards

Cards should be used to group related content and actions.

#### Design Guidelines

- Use cards for discrete pieces of content
- Maintain consistent padding (16px/1rem) inside cards
- Use card headers for titles and subtitles
- Place primary actions in the card actions area
- Limit the number of actions on a card

#### Usage Guidelines

```html
<acp-mat-dynamic-card
  [cardTitle]="'Card Title'"
  [isHeaderVisible]="true"
  [contentPadding]="'1rem'"
  [areActionsVisible]="true"
  [primaryButtonText]="'Primary Action'"
>
  Card content goes here
</acp-mat-dynamic-card>
```

### Dialogs

Dialogs should be used for focused tasks and confirmations.

#### Design Guidelines

- Keep dialogs focused on a single task
- Use clear, descriptive titles
- Provide clear actions (primary and secondary)
- Size dialogs appropriately for their content
- Use consistent padding (24px/1.5rem) inside dialogs

#### Usage Guidelines

```typescript
this.dialogService.openInWrapper({
  component: YourDialogContentComponent,
  title: 'Dialog Title',
  icon: 'info',
  data: {
    /* dialog data */
  },
});
```

### Buttons

Buttons should be used for actions and navigation.

#### Button Hierarchy

- **Primary buttons**: Use for the main action on a page or in a component
- **Secondary buttons**: Use for alternative actions
- **Text buttons**: Use for less important actions
- **Icon buttons**: Use for common actions with recognizable icons

#### Button Placement

- Place primary actions on the right in dialogs and forms
- Group related actions together
- Maintain consistent order of actions (e.g., Cancel/Confirm)
- Use appropriate spacing between buttons (8px/0.5rem)

### Forms

Forms should be clear, accessible, and easy to use.

#### Form Guidelines

- Group related form fields together
- Use clear, concise labels for form fields
- Provide helpful error messages
- Use consistent spacing between form fields (16px/1rem)
- Align labels and inputs consistently

### Tables

Tables should present data in a clear, organized way.

#### Table Guidelines

- Use appropriate column widths for content
- Align text consistently (left for text, right for numbers)
- Use pagination for large data sets
- Provide sorting and filtering options when appropriate
- Use consistent row heights and padding

### Navigation

Navigation should be intuitive and consistent.

#### Navigation Guidelines

- Use clear, descriptive labels for navigation items
- Highlight the current section or page
- Provide visual feedback for hover and active states
- Ensure navigation is accessible via keyboard

## Accessibility Guidelines

All components should follow these accessibility guidelines:

- Ensure sufficient color contrast (WCAG AA minimum)
- Provide text alternatives for non-text content
- Ensure keyboard navigability
- Support screen readers with appropriate ARIA attributes
- Design for different screen sizes and orientations
- Ensure touch targets are large enough (minimum 48px)

## Responsive Design

Components should adapt to different screen sizes:

- Use responsive layouts that adjust to screen width
- Design for mobile-first, then enhance for larger screens
- Use breakpoints consistently across components
- Test components on various devices and screen sizes

## Animation Guidelines

Animations should enhance the user experience without being distracting:

- Keep animations subtle and purposeful
- Use consistent timing for similar animations
- Provide options to reduce motion for users who prefer it
- Ensure animations don't block user interaction
- Use Angular's animation system for consistent implementation

```typescript
// Example of a subtle animation
animations: [
  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-in', style({ opacity: 1 })),
    ]),
  ]),
];
```

By following these guidelines, you'll create a consistent, accessible, and
user-friendly experience with the acontplus-ui-components library.
