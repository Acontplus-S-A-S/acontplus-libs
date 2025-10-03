# @acontplus/ng-components

Angular UI components library for AcontPlus applications, providing reusable components, directives, pipes, and services built with Angular Material.

## Installation

```bash
npm install @acontplus/ng-components
```

## Features

- **UI Components**: Cards, dialogs, icons, input chips, theme buttons, spinners, tables, theme toggle, autocomplete wrapper
- **Directives**: Text transformation directives (to-upper-case)
- **Pipes**: Data transformation pipes (get-total, status-display)
- **Services**: Dialog management, overlay services, theme management, autocomplete functionality
- **Form Controls**: Dynamic input components
- **Styling**: Custom SCSS mixins, variables, and theme support including dark mode
- **Angular Material Integration**: Built on top of Angular Material for consistent design
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Components

### Cards

Reusable card components for displaying content.

### Dialog Wrapper

Enhanced dialog components with wrapper functionality.

### Icons

Icon components for consistent iconography.

### Material Input Chip

Chip input components integrated with Angular Material.

### Material Theme Button

Themed button components.

### Spinner

Loading spinner components.

### Tables

Table components for data display.

### Theme Toggle

Dark/light mode toggle component.

### Autocomplete Wrapper

Enhanced autocomplete components.

## Directives

### To Upper Case

Directive to transform text to uppercase.

## Pipes

### Get Total

Pipe for calculating totals from arrays.

### Status Display

Pipe for formatting status values.

## Services

### Dialog Service

Service for managing dialogs.

### Overlay Service

Service for overlay management.

### Theme Service

Service for theme management including dark mode.

### Autocomplete Wrapper Service

Service for autocomplete functionality.

## Form Controls

### Dynamic Input

Dynamic form input components.

## Styling

The library includes custom SCSS files for theming and styling:

- Custom button styles
- Custom dialog styles
- Mixins for reusable styles
- CSS variables for theming

## Usage

Import the components you need:

```typescript
import { CardsComponent, ThemeToggleComponent } from '@acontplus/ng-components';
```

## Running unit tests

Run `nx test ng-components` to execute the unit tests.
