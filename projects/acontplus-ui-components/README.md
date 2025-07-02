# `acontplus/ui-components`

A comprehensive UI component library for Acontplus applications built with Angular Material. This library provides a collection of reusable, customizable UI components to ensure consistency across Acontplus projects and accelerate development.

## Installation

You can install this library using npm:

```bash
npm install acontplus/ui-components
```

## Dependencies

This library requires the following peer dependencies:

- Angular (version 20.x)
- Angular Material
- RxJS

## Usage

This library exports various UI components and related modules. Below are some common usage patterns.

### Components

#### Cards

The library includes various card components for displaying content in a structured way.

```typescript
import { MatDynamicCardComponent } from 'acontplus/ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    MatDynamicCardComponent
  ]
})

// In your component template
// <mat-dynamic-card [title]="'Card Title'" [content]="'Card content goes here'"></mat-dynamic-card>
```

#### Dialog Wrapper

A wrapper component for Angular Material dialogs with consistent styling.

```typescript
import { DialogWrapperComponent } from 'acontplus/ui-components';

// In your dialog service
this.dialog.open(DialogWrapperComponent, {
  data: {
    title: 'Dialog Title',
    content: 'Dialog content goes here',
    actions: [
      { label: 'Cancel', value: false },
      { label: 'Confirm', value: true }
    ]
  }
});
```

#### Icons

Custom icon components that extend Material icons.

```typescript
import { IconComponent } from 'acontplus/ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    IconComponent
  ]
})

// In your component template
// <app-icon name="home"></app-icon>
```

#### Input Chip

A component for displaying and managing input chips.

```typescript
import { MatInputChipComponent } from 'acontplus/ui-components';

// In your module
@NgModule({
  imports: [
    // ...
    MatInputChipComponent
  ]
})

// In your component template
// <mat-input-chip [items]="items" (itemsChange)="onItemsChange($event)"></mat-input-chip>
```

#### Theme Button

A button component for toggling between themes.

```typescript
import { MatThemeButtonComponent } from 'acontplus/ui-components';

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
import { SnackbarService } from 'acontplus/ui-components';

// In your component
constructor(private snackbar: SnackbarService) {}

showNotification() {
  this.snackbar.show('Operation successful!', 'success');
}
```

#### Spinner

A loading spinner component.

```typescript
import { SpinnerComponent } from 'acontplus/ui-components';

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
import { MatTableComponent } from 'acontplus/ui-components';

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
import { ThemeToggleComponent } from 'acontplus/ui-components';

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
import { ClickOutsideDirective } from 'acontplus/ui-components';

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
import { CustomInputComponent } from 'acontplus/ui-components';

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
import { LoadingInterceptor } from 'acontplus/ui-components';

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
import { TableColumn } from 'acontplus/ui-components';

const columns: TableColumn[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: 'Name' }
];
```

### Pipes

Data transformation pipes for use in templates.

```typescript
import { TruncatePipe } from 'acontplus/ui-components';

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
import { ThemeService } from 'acontplus/ui-components';

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
@import 'acontplus/ui-components/theme';

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
