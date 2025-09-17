# `acontplus-ui-components`

Angular Material UI component library with dynamic tables, theming support, dialog wrappers, customer management components, and comprehensive styling utilities.

## Installation

```bash
npm install acontplus-ui-components
```

## Dependencies

This library requires the following peer dependencies:

- Angular (version 20.x)
- Angular Material (version 20.x)
- Angular CDK (version 20.x)
- acontplus-core (version ^1.2.6)

## 🧩 Available Components

### Core Components

- **MatDynamicCardComponent** (`acp-mat-dynamic-card`) - Versatile card component with configurable header, content, and actions
- **MatDynamicTableComponent** (`acp-mat-dynamic-table`) - Flexible data table with sorting, pagination, and filtering
- **MatInputChipComponent** (`acp-mat-input-chip`) - Input field with chip functionality for tags and selections

### Dialog & Overlay

- **DialogWrapperComponent** (`acp-dialog-wrapper`) - Draggable dialog wrapper with consistent styling
- **AdvancedDialogService** - Service for enhanced dialog management
- **OverlayService** - Service for overlay management

### Theme & UI

- **ThemeToggleComponent** (`acp-theme-toggle`) - Toggle component for switching between light/dark themes
- **ThemeService** - Service for theme management
- **MatThemeButtonComponent** (`acp-mat-theme-button`) - Theme-aware button component

### Icons & Visual

- **SvgIconComponent** (`acp-svg-icon`) - Scalable vector icon component
- **IconUserComponent** (`acp-icon-user`) - User-specific icon component
- **SpinnerComponent** (`acp-spinner`) - Loading indicator component

### Tables & Data

- **CustomTabulatorComponent** (`acp-custom-tabulator`) - Advanced table with Tabulator.js integration
- **MatDynamicTableComponent** (`acp-mat-dynamic-table`) - Material Design data table

### Notifications & Feedback

- **SnackbarNotificationComponent** (`acp-snackbar-notification`) - Toast notification component
- **SnackbarService** - Service for snackbar management

### Utilities

- **AutocompleteWrapperComponent** (`acp-autocomplete-wrapper`) - Enhanced autocomplete component
- **AutocompleteWrapperService** - Service for autocomplete functionality
- **ToUpperCaseDirective** - Directive for automatic text transformation

### Customer Management

- **CustomerAddEditComponent** (`acp-customer-add-edit`) - Customer form component
- **CustomerCardComponent** (`acp-customer-card`) - Customer display card

### Pipes

- **GetTotalPipe** - Calculate totals from arrays
- **StatusDisplayPipe** - Format status values for display

## 🎨 Styling & Theming

The library includes comprehensive SCSS utilities:

- **Custom Buttons** (`acontplus-ui-components/styles/buttons`) - Enhanced button styles
- **Dialog Theming** (`acontplus-ui-components/styles/dialog`) - Dialog customizations  
- **Snackbar Theming** (`acontplus-ui-components/styles/snackbar`) - Snackbar styles
- **Complete Styles** (`acontplus-ui-components/styles`) - All styles bundle

## 🚀 Quick Start

### Basic Setup

```typescript
import { MatDynamicCardComponent, ThemeToggleComponent } from 'acontplus-ui-components';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MatDynamicCardComponent, ThemeToggleComponent],
  template: `
    <acp-theme-toggle></acp-theme-toggle>
    <acp-mat-dynamic-card 
      [cardTitle]="'Welcome'" 
      [cardSubtitle]="'Getting started'"
      [isHeaderVisible]="true">
      Your content here
    </acp-mat-dynamic-card>
  `
})
export class ExampleComponent { }
// <mat-input-chip [items]="items" (itemsChange)="onItemsChange($event)"></mat-input-chip>
```

#### Theme Button

A button component for toggling between themes.

```typescript
import { MatThemeButtonComponent } from 'acontplus-ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    MatThemeButtonComponent
  ]
})

// In your component template
// <mat-theme-button></mat-theme-button>
```

#### Snackbar

A service for displaying snackbar notifications.

```typescript
import { SnackbarService } from 'acontplus-ui-components';

// In your component
constructor(private snackbar: SnackbarService) {}

showNotification() {
  this.snackbar.show('Operation successful!', 'success');
}
```

#### Spinner

A loading spinner component.

```typescript
import { SpinnerComponent } from 'acontplus-ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    SpinnerComponent
  ]
})

// In your component template
// <app-spinner [loading]="isLoading"></app-spinner>
```

#### Tables

Customizable table components.

```typescript
import { MatTableComponent } from 'acontplus-ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    MatTableComponent
  ]
})

// In your component template
// <mat-table [data]="tableData" [columns]="tableColumns"></mat-table>
```

#### Theme Toggle

A component for toggling between light and dark themes.

```typescript
import { ThemeToggleComponent } from 'acontplus-ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    ThemeToggleComponent
  ]
})

// In your component template
// <app-theme-toggle></app-theme-toggle>
```

### Directives

The library includes various directives to enhance HTML elements with additional functionality.

```typescript
import { ClickOutsideDirective } from 'acontplus-ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    ClickOutsideDirective
  ]
})

// In your component template
// <div (clickOutside)="onClickOutside()">Content</div>
```

### Inputs

Custom form input components.

```typescript
import { CustomInputComponent } from 'acontplus-ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    CustomInputComponent
  ]
})

// In your component template
// <app-custom-input [(ngModel)]="value"></app-custom-input>
```

### Interceptors

HTTP interceptors for handling API requests.

```typescript
import { LoadingInterceptor } from 'acontplus-ui-components';

// In your app module
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
})
```

### Models

Type definitions and interfaces for UI components.

```typescript
import { TableColumn } from 'acontplus-ui-components';

const columns: TableColumn[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: 'Name' },
];
```

### Pipes

Data transformation pipes for use in templates.

```typescript
import { TruncatePipe } from 'acontplus-ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    TruncatePipe
  ]
})

// In your component template
// {{ longText | truncate:100 }}
```

### Services

Utility services for UI-related functionality.

```typescript
import { ThemeService } from 'acontplus-ui-components';

// In your component
constructor(private themeService: ThemeService) {}

toggleTheme() {
  this.themeService.toggleTheme();
}
```

## Theming

The library supports Angular Material theming. You can customize the theme by including the library's theme file in your application's styles.

```scss
/* In your styles.scss */
@import 'acontplus-ui-components/theme';

/* Customize theme variables */
$primary: mat.define-palette(mat.$indigo-palette);
$accent: mat.define-palette(mat.$pink-palette);

/* Include the theme */
@include acontplus-ui-theme($primary, $accent);
```

## Folder Structure

The library follows this structure:

```
src/
├── lib/
│   ├── components/    # UI components
│   │   ├── cards/
│   │   ├── dialog-wrapper/
│   │   ├── icons/
│   │   ├── mat-input-chip/
│   │   ├── mat-theme-button/
│   │   ├── snackbar/
│   │   ├── spinner/
│   │   ├── tables/
│   │   └── theme-toggle/
│   ├── constants/     # Constant values and enums
│   ├── directives/    # Custom directives
│   ├── inputs/        # Form input components
│   ├── interceptors/  # HTTP interceptors
│   ├── models/        # Type definitions and interfaces
│   ├── pipes/         # Data transformation pipes
│   └── services/      # UI-related services
└── public-api.ts      # Main entry point for the library
```

## Development

If you wish to contribute to this library or run it locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Acontplus-S-A-S/acontplus-libs.git
   cd acontplus-libs
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the library:**

   ```bash
   npm run build-library
   ```

4. **Run the test application:**
   ```bash
   npm start
   ```

## Building

To build the library, run:

```bash
ng build acontplus-ui-components
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

## Testing

To execute unit tests with Karma, use:

```bash
ng test acontplus-ui-components
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://www.google.com/search?q=CONTRIBUTING.md) for details on how to submit pull requests, report bugs, and suggest features.

## License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).
