# @acontplus/ng-components

Angular Material UI component library with dynamic tables, theming support, dialog wrappers, and comprehensive styling utilities for AcontPlus applications.

## Installation

```bash
npm install @acontplus/ng-components
```

## Features

- **UI Components**: Dynamic cards, dialogs, icons, input chips, buttons, spinners, dynamic/tabulator tables, theme toggle, autocomplete wrapper
- **Directives**: Text transformation (to-upper-case)
- **Pipes**: Data transformation (get-total, status-display)
- **Services**: Dialog management, overlay, theme management (dark/light mode), autocomplete
- **Form Controls**: Dynamic input components
- **Models**: Table models, pagination, autocomplete wrapper models
- **Types**: Tabulator table type definitions
- **Styling**: Custom SCSS mixins, variables, dialog styles, and theme support
- **Angular Material Integration**: Built on Angular Material for consistent design
- **TypeScript Support**: Full type safety with comprehensive definitions

## Components

### Cards

#### DynamicCard

Versatile card component wrapping Angular Material's mat-card with additional functionality.

```typescript
import { DynamicCard } from '@acontplus/ng-components';

@Component({
  template: `
    <acp-dynamic-card
      [cardTitle]="'Product Details'"
      [cardSubtitle]="'Premium Package'"
      [isHeaderVisible]="true"
      [areActionsVisible]="true"
      [primaryButtonText]="'Buy Now'"
      [secondaryButtonText]="'Learn More'"
      (primaryButtonClicked)="onPurchase()"
      (secondaryButtonClicked)="onLearnMore()"
    >
      <p>Card content goes here</p>
    </acp-dynamic-card>
  `,
  imports: [DynamicCard],
})
export class ProductComponent {}
```

### Buttons

#### Button

Flexible button component with multiple Material Design variants.

```typescript
import { Button } from '@acontplus/ng-components';

@Component({
  template: `
    <acp-button
      [variant]="'primary'"
      [text]="'Save'"
      [icon]="'save'"
      [matStyle]="'elevated'"
      [disabled]="false"
      (handleClick)="onSave()"
    >
    </acp-button>
  `,
  imports: [Button],
})
export class FormComponent {}
```

### Dialog Wrapper

Enhanced dialog components with wrapper functionality for consistent dialog management.

```typescript
import { DialogWrapper } from '@acontplus/ng-components';
```

### Icons

#### UserIcon & SvgIcon

Icon components for consistent iconography.

```typescript
import { UserIcon, SvgIcon } from '@acontplus/ng-components';
```

### Input Chip

Chip input components integrated with Angular Material for tag/chip selection.

```typescript
import { InputChip } from '@acontplus/ng-components';
```

### Spinner

Loading spinner components for async operations.

```typescript
import { Spinner } from '@acontplus/ng-components';
```

### Tables

- **DynamicTable**: Angular Material-based dynamic table with advanced features
- **TabulatorTable**: Advanced table with Tabulator.js integration

```typescript
import { DynamicTable, TabulatorTable } from '@acontplus/ng-components';
```

#### Dynamic Table Features

- **Row Selection**: Single/multiple selection with disabled rows support
- **Row Styling**: Theme-aware dynamic row colors based on data properties
- **Expandable Rows**: Collapsible detail views
- **Pagination**: Built-in pagination support
- **Column Templates**: Custom column rendering
- **Sorting & Filtering**: Material table sorting capabilities

```typescript
// Row styling example
interface TableRow {
  rowStyle?: {
    backgroundColor?: string;
    color?: string;
    [key: string]: any;
  };
  disableSelection?: boolean;
}

// Usage with theme-aware colors
const data = [
  {
    id: 1,
    name: 'Item 1',
    status: 'active',
    rowStyle: {
      backgroundColor: 'var(--mat-sys-primary-container)',
      color: 'var(--mat-sys-on-primary-container)',
    },
  },
  {
    id: 2,
    name: 'Item 2',
    status: 'processing',
    disableSelection: true,
    rowStyle: {
      backgroundColor: '#e3f2fd',
      color: '#1565c0',
    },
  },
];
```

#### Tabulator Table Features

- **Row Styling**: Same rowStyle property support as Dynamic Table
- **Advanced Filtering**: Built-in Tabulator filtering
- **Virtual Scrolling**: Performance optimization for large datasets
- **Tree Data**: Hierarchical data support
- **Custom Themes**: Material Design integration

```typescript
// Tabulator with row styling
<acp-tabulator-table
  [data]="tableData"
  [columns]="columns"
  [height]="400"
  [theme]="{ name: 'materialize' }"
/>
```

**Note**: Tabulator tables require `tabulator-tables` as a peer dependency:

```bash
npm install tabulator-tables
```

#### Theme Integration

Both table components support automatic theme adaptation:

```scss
// Import Tabulator Material theme
@import 'tabulator-tables/dist/css/tabulator_materialize.min.css';
```

Row colors automatically adapt to light/dark themes using Material Design tokens or custom theme detection.

### Theme Toggle

Dark/light mode toggle component for theme switching.

```typescript
import { ThemeToggle } from '@acontplus/ng-components';
```

### Autocomplete Wrapper

Enhanced autocomplete components with custom functionality.

```typescript
import { AutocompleteWrapperComponent } from '@acontplus/ng-components';
```

## Directives

### ToUpperCase

Transforms input text to uppercase automatically.

```typescript
import { ToUpperCase } from '@acontplus/ng-components';
```

## Pipes

### GetTotalPipe

Calculates totals from arrays of objects.

```typescript
import { GetTotalPipe } from '@acontplus/ng-components';
```

### StatusDisplayPipe

Formats status values for display.

```typescript
import { StatusDisplayPipe } from '@acontplus/ng-components';
```

## Services

### AdvancedDialogService

Manages dialog creation and lifecycle with advanced features.

```typescript
import { AdvancedDialogService } from '@acontplus/ng-components';
```

### OverlayService

Manages overlay components and positioning.

```typescript
import { OverlayService } from '@acontplus/ng-components';
```

### ThemeSwitcher

Manages application theme (dark/light mode) with persistence.

```typescript
import { ThemeSwitcher } from '@acontplus/ng-components';
```

### AutocompleteWrapperService

Provides autocomplete functionality and data management.

```typescript
import { AutocompleteWrapperService } from '@acontplus/ng-components';
```

## Form Controls

### DynamicInput

Dynamic form input components for flexible form creation.

```typescript
import { DynamicInput } from '@acontplus/ng-components';
```

## Models

Exported models for type safety:

- **Mat Table Models**: Material table configuration models
- **Pagination**: Pagination models and interfaces
- **Autocomplete Wrapper**: Autocomplete configuration models

```typescript
import { PaginationModel, AutocompleteWrapperModel } from '@acontplus/ng-components';
```

## Types

### Tabulator Types

TypeScript definitions for Tabulator table configurations.

```typescript
import { TabulatorTypes } from '@acontplus/ng-components';
```

## Styling

The library includes custom SCSS files:

- **\_mixins.scss**: Reusable SCSS mixins
- **\_variables.scss**: Theme variables and constants
- **\_custom-dialog.scss**: Custom dialog styles
- **index.scss**: Main stylesheet entry point

Import styles in your application:

```scss
@import '@acontplus/ng-components/styles';
// For Tabulator Material theme
@import 'tabulator-tables/dist/css/tabulator_materialize.min.css';
```

### Theme-Aware Row Styling

Components support dynamic row styling that adapts to Material Design themes:

```typescript
// Theme detection utility
const isDark = document.documentElement.classList.contains('dark-theme');

// Status-based styling
function getStatusStyle(status: string) {
  switch (status) {
    case 'success':
      return isDark
        ? { backgroundColor: '#1b5e20', color: '#81c784' }
        : { backgroundColor: '#e8f5e8', color: '#2e7d32' };
    case 'error':
      return isDark
        ? { backgroundColor: '#b71c1c', color: '#ffcdd2' }
        : { backgroundColor: '#ffebee', color: '#c62828' };
    default:
      return {};
  }
}
```

## Peer Dependencies

- `@angular/cdk`: ^20.2.5
- `@angular/common`: ^20.3.2
- `@angular/core`: ^20.3.2
- `@angular/material`: ^20.2.5
- `tabulator-tables`: ^6.3.1
