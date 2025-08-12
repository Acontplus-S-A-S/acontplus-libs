# UI Component Usage Examples

This document provides detailed usage examples for all UI components in the
acontplus-ui-components library, including code snippets and explanations of
component features.

## Table of Contents

- [Cards](#cards)
  - [MatDynamicCardComponent](#matdynamiccardcomponent)
- [Dialog Wrapper](#dialog-wrapper)
- [Icons](#icons)
- [Mat Input Chip](#mat-input-chip)
- [Mat Theme Button](#mat-theme-button)
- [Snackbar](#snackbar)
- [Spinner](#spinner)
- [Tables](#tables)
- [Theme Toggle](#theme-toggle)
- [Autocomplete Wrapper](#autocomplete-wrapper)

## Cards

### MatDynamicCardComponent

The `MatDynamicCardComponent` is a versatile card component that wraps Angular
Material's `mat-card` with additional functionality and customization options.

#### Basic Usage

```typescript
// In your module
import { MatDynamicCardComponent } from 'acontplus/ui-components';

@NgModule({
  imports: [
    // ...
    MatDynamicCardComponent,
  ],
})
export class YourModule {}
```

```html
<!-- Basic card with content -->
<acp-mat-dynamic-card>
  <p>This is the card content.</p>
</acp-mat-dynamic-card>
```

#### With Header

```html
<!-- Card with header -->
<acp-mat-dynamic-card
  [cardTitle]="'Card Title'"
  [cardSubtitle]="'Card Subtitle'"
  [isHeaderVisible]="true"
>
  <p>This is a card with a header.</p>
</acp-mat-dynamic-card>
```

#### With Avatar

```html
<!-- Card with avatar -->
<acp-mat-dynamic-card
  [cardTitle]="'Profile Card'"
  [cardSubtitle]="'User Information'"
  [avatarImageUrl]="'assets/images/user-avatar.jpg'"
  [isHeaderVisible]="true"
>
  <p>This is a profile card with an avatar image.</p>
</acp-mat-dynamic-card>
```

#### With Actions

```html
<!-- Card with action buttons -->
<acp-mat-dynamic-card
  [cardTitle]="'Action Card'"
  [isHeaderVisible]="true"
  [areActionsVisible]="true"
  [primaryButtonText]="'Save'"
  [secondaryButtonText]="'Cancel'"
  [primaryButtonIcon]="'save'"
  [secondaryButtonIcon]="'cancel'"
  [buttonsPosition]="'end'"
  (primaryButtonClicked)="onSave()"
  (secondaryButtonClicked)="onCancel()"
>
  <p>This is a card with action buttons.</p>
</acp-mat-dynamic-card>
```

#### With Custom Content Padding and Divider

```html
<!-- Card with custom padding and divider -->
<acp-mat-dynamic-card
  [cardTitle]="'Custom Card'"
  [isHeaderVisible]="true"
  [contentPadding]="'2rem'"
  [hasDivider]="true"
>
  <p>
    This card has custom padding and a divider between the header and content.
  </p>
</acp-mat-dynamic-card>
```

#### Handling Card Click Events

```html
<!-- Card with click event -->
<acp-mat-dynamic-card
  [cardTitle]="'Clickable Card'"
  [isHeaderVisible]="true"
  (cardClicked)="onCardClick($event)"
>
  <p>Click anywhere on this card to trigger an event.</p>
</acp-mat-dynamic-card>
```

```typescript
// In your component
export class YourComponent {
  onCardClick(event: Event): void {
    console.log('Card clicked:', event);
    // Handle the card click event
  }

  onSave(): void {
    console.log('Save button clicked');
    // Handle the save action
  }

  onCancel(): void {
    console.log('Cancel button clicked');
    // Handle the cancel action
  }
}
```

#### Component API

**Inputs:**

| Name                | Type             | Default   | Description                                          |
| ------------------- | ---------------- | --------- | ---------------------------------------------------- |
| cardTitle           | string \| null   | null      | The title text for the card header                   |
| cardSubtitle        | string \| null   | null      | The subtitle text for the card header                |
| avatarImageUrl      | string \| null   | null      | URL for the avatar image in the card header          |
| isHeaderVisible     | boolean          | false     | Whether to show the card header                      |
| contentPadding      | string           | '1rem'    | CSS padding value for the card content               |
| hasDivider          | boolean          | false     | Whether to show a divider between header and content |
| areActionsVisible   | boolean          | false     | Whether to show the action buttons                   |
| primaryButtonText   | string           | 'Confirm' | Text for the primary action button                   |
| secondaryButtonText | string           | 'Cancel'  | Text for the secondary action button                 |
| primaryButtonIcon   | string \| null   | null      | Material icon name for the primary button            |
| secondaryButtonIcon | string \| null   | null      | Material icon name for the secondary button          |
| buttonsPosition     | 'start' \| 'end' | 'end'     | Alignment of the action buttons                      |

**Outputs:**

| Name                   | Type  | Description                                  |
| ---------------------- | ----- | -------------------------------------------- |
| primaryButtonClicked   | void  | Emitted when the primary button is clicked   |
| secondaryButtonClicked | void  | Emitted when the secondary button is clicked |
| cardClicked            | Event | Emitted when the card is clicked             |

**Styling:**

The component uses Angular Material's theming system. You can customize the
appearance by overriding the Material card styles in your application's theme.

```scss
// Example of customizing the card appearance
.mat-mdc-card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mat-mdc-card-title {
  font-size: 1.25rem;
  font-weight: 500;
}
```

**Example Screenshot:**

![MatDynamicCard Example](../assets/images/mat-dynamic-card-example.png)

_Note: The actual appearance may vary based on your application's theme._

## Dialog Wrapper

The `DialogWrapperComponent` is a wrapper for Angular Material dialogs that
provides a consistent look and feel, including a draggable header and the
ability to dynamically create components inside the dialog.

### Basic Usage

To use the DialogWrapperComponent, you need to inject the AdvancedDialogService
and call its `openInWrapper` method:

```typescript
import { Component } from '@angular/core';
import { AdvancedDialogService } from 'acontplus/ui-components';
import { YourDialogContentComponent } from './your-dialog-content.component';

@Component({
  selector: 'app-your-component',
  template: `<button (click)="openDialog()">Open Dialog</button>`,
})
export class YourComponent {
  constructor(private dialogService: AdvancedDialogService) {}

  async openDialog(): Promise<void> {
    const dialogRef = await this.dialogService.openInWrapper({
      component: YourDialogContentComponent,
      title: 'Dialog Title',
      icon: 'info',
      data: {
        message: 'This is some data passed to the dialog content component',
      },
    });

    const result = await dialogRef.afterClosed().toPromise();
    console.log('Dialog closed with result:', result);
  }
}
```

### Creating a Dialog Content Component

The content component that will be rendered inside the dialog wrapper should be
designed to receive data:

```typescript
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogWrapperComponent } from 'acontplus/ui-components';

@Component({
  selector: 'app-your-dialog-content',
  template: `
    <div class="dialog-content">
      <p>{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-button color="primary" (click)="confirm()">Confirm</button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        padding: 16px;
      }
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 16px;
      }
    `,
  ],
})
export class YourDialogContentComponent {
  @Input() data: any;

  constructor(private dialogRef: MatDialogRef<DialogWrapperComponent>) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
```

### Advanced Configuration

The `openInWrapper` method accepts a second parameter for configuring the
Material dialog:

```typescript
async openAdvancedDialog(): Promise<void> {
  const dialogRef = await this.dialogService.openInWrapper(
    {
      component: YourDialogContentComponent,
      title: 'Advanced Dialog',
      icon: 'settings',
      data: { message: 'This is an advanced dialog configuration' },
      hideHeader: false // Set to true to hide the header
    },
    {
      size: 'lg', // 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full'
      width: '800px', // Custom width (overrides size)
      height: '600px', // Custom height
      position: { top: '100px' }, // Custom position
      panelClass: 'custom-dialog-class', // Custom CSS class
      backdropClass: 'custom-backdrop-class', // Custom backdrop CSS class
      hasBackdrop: true, // Whether to show a backdrop
      backdropClickClosable: true, // Whether clicking the backdrop closes the dialog
      escapeKeyClosable: true, // Whether pressing escape closes the dialog
      isMobileFullScreen: true // Whether to make the dialog fullscreen on mobile devices
    }
  );

  const result = await dialogRef.afterClosed().toPromise();
  console.log('Advanced dialog closed with result:', result);
}
```

### Responsive Behavior

The dialog wrapper automatically adjusts to different screen sizes. On mobile
devices, it can be configured to display fullscreen:

```typescript
async openResponsiveDialog(): Promise<void> {
  const dialogRef = await this.dialogService.openInWrapper(
    {
      component: YourDialogContentComponent,
      title: 'Responsive Dialog',
      data: { message: 'This dialog adapts to different screen sizes' }
    },
    {
      isMobileFullScreen: true, // Makes the dialog fullscreen on mobile devices
      size: 'md' // Default size for larger screens
    }
  );
}
```

### Draggable Dialog

The dialog header serves as a drag handle, allowing users to move the dialog
around the screen:

```typescript
async openDraggableDialog(): Promise<void> {
  const dialogRef = await this.dialogService.openInWrapper({
    component: YourDialogContentComponent,
    title: 'Draggable Dialog',
    data: { message: 'You can drag this dialog by its header' }
  });
}
```

### Component API

**DialogWrapperConfig Interface:**

| Property   | Type      | Required | Description                                 |
| ---------- | --------- | -------- | ------------------------------------------- |
| component  | Type<any> | Yes      | The component to render inside the dialog   |
| title      | string    | Yes      | The title to display in the dialog header   |
| icon       | string    | No       | Material icon name to display in the header |
| data       | any       | No       | Data to pass to the content component       |
| hideHeader | boolean   | No       | Whether to hide the dialog header           |

**MatCustomDialogConfig Interface (partial):**

| Property              | Type                                                             | Description                                             |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| size                  | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| 'full'          | Predefined size for the dialog                          |
| width                 | string                                                           | Custom width for the dialog                             |
| height                | string                                                           | Custom height for the dialog                            |
| position              | { top?: string; bottom?: string; left?: string; right?: string } | Custom position for the dialog                          |
| panelClass            | string \| string[]                                               | CSS class(es) to add to the dialog container            |
| backdropClass         | string \| string[]                                               | CSS class(es) to add to the backdrop                    |
| hasBackdrop           | boolean                                                          | Whether to show a backdrop                              |
| backdropClickClosable | boolean                                                          | Whether clicking the backdrop closes the dialog         |
| escapeKeyClosable     | boolean                                                          | Whether pressing escape closes the dialog               |
| isMobileFullScreen    | boolean                                                          | Whether to make the dialog fullscreen on mobile devices |

**Example Screenshot:**

![DialogWrapper Example](../assets/images/dialog-wrapper-example.png)

_Note: The actual appearance may vary based on your application's theme._

## Autocomplete Wrapper

The `AutocompleteWrapperComponent` is a powerful, feature-rich autocomplete component that provides advanced search capabilities, local and remote data handling, and customizable filtering options.

### Basic Usage

```typescript
// In your module
import { ReusableAutocompleteComponent } from 'acontplus/ui-components';

@NgModule({
  imports: [
    // ...
    ReusableAutocompleteComponent,
  ],
})
export class YourModule {}
```

```html
<!-- Basic autocomplete with local data -->
<acp-autocomplete-wrapper
  [dataSource]="users"
  [config]="autocompleteConfig"
  (itemSelected)="onUserSelected($event)"
>
</acp-autocomplete-wrapper>
```

### Configuration

The component accepts a comprehensive configuration object:

```typescript
// In your component
export class YourComponent {
  autocompleteConfig: AutocompleteWrapperConfig = {
    minSearchLength: 2,
    itemsPerPage: 10,
    enableStockFilter: true,
    stockProperty: 'stock',
    searchFields: [
      { value: 'name', property: 'name', label: 'Name' },
      { value: 'email', property: 'email', label: 'Email' },
      { value: 'username', property: 'username', label: 'Username' }
    ],
    defaultSearchField: 'name',
    enableHistory: true,
    maxHistoryItems: 5,
    enableAdvancedSearch: true,
    enableCreateOption: true,
    createOptionText: 'Create new user',
    notFoundText: 'No users found',
    loadingText: 'Searching...',
    placeholder: 'Search users...'
  };

  users: AutocompleteWrapperItem[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johndoe', stock: 10 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', username: 'janesmith', stock: 0 },
    // ... more users
  ];
}
```

### Advanced Search with Remote Data

```html
<!-- Autocomplete with remote search function -->
<acp-autocomplete-wrapper
  [config]="remoteSearchConfig"
  [searchFunction]="searchUsers"
  (itemSelected)="onUserSelected($event)"
  (searchRequested)="onSearchRequested($event)"
>
</acp-autocomplete-wrapper>
```

```typescript
// In your component
export class YourComponent {
  remoteSearchConfig: AutocompleteWrapperConfig = {
    minSearchLength: 3,
    itemsPerPage: 20,
    enableAdvancedSearch: true,
    enableCreateOption: true,
    searchFields: [
      { value: 'name', property: 'name', label: 'Name' },
      { value: 'email', property: 'email', label: 'Email' }
    ]
  };

  searchUsers: AutocompleteWrapperSearchFunction = (
    query: string,
    filters: AutocompleteWrapperFilters,
    page: number
  ): Observable<AutocompleteWrapperSearchResult> => {
    return this.userService.searchUsers(query, filters, page).pipe(
      map(response => ({
        items: response.items,
        totalCount: response.totalCount,
        hasMore: response.hasMore
      }))
    );
  };

  onSearchRequested(event: { query: string; filters: AutocompleteWrapperFilters; page: number }): void {
    console.log('Search requested:', event);
  }
}
```

### Custom Item Templates

```html
<!-- Custom item template -->
<acp-autocomplete-wrapper
  [dataSource]="products"
  [config]="productConfig"
  (itemSelected)="onProductSelected($event)"
>
  <ng-template #itemTemplate let-item>
    <div class="product-item">
      <img [src]="item.imageUrl" [alt]="item.name" class="product-image">
      <div class="product-details">
        <div class="product-name">{{ item.name }}</div>
        <div class="product-price">{{ item.price | currency }}</div>
        <div class="product-stock" [class.out-of-stock]="item.stock === 0">
          Stock: {{ item.stock }}
        </div>
      </div>
    </div>
  </ng-template>
</acp-autocomplete-wrapper>
```

### Custom Not Found Template

```html
<!-- Custom not found template -->
<acp-autocomplete-wrapper
  [dataSource]="items"
  [config]="config"
  (itemSelected)="onItemSelected($event)"
>
  <ng-template #notFoundTemplate let-query>
    <div class="not-found">
      <mat-icon>search_off</mat-icon>
      <p>No items found for "{{ query }}"</p>
      <button mat-button (click)="createNewItem(query)">
        Create new item
      </button>
    </div>
  </ng-template>
</acp-autocomplete-wrapper>
```

### Handling Events

```typescript
export class YourComponent {
  onUserSelected(user: AutocompleteWrapperItem): void {
    console.log('Selected user:', user);
    // Handle user selection
  }

  onSearchChanged(query: string): void {
    console.log('Search query changed:', query);
    // Handle search query changes
  }

  onPageChanged(page: number): void {
    console.log('Page changed to:', page);
    // Handle pagination
  }

  onFilterChanged(filters: AutocompleteWrapperFilters): void {
    console.log('Filters changed:', filters);
    // Handle filter changes
  }

  onAdvancedSearchClicked(): void {
    console.log('Advanced search clicked');
    // Open advanced search dialog
  }

  onAllResultsClicked(query: string): void {
    console.log('All results clicked for:', query);
    // Navigate to full search results
  }

  onCreateClicked(query: string): void {
    console.log('Create clicked for:', query);
    // Open create dialog
  }
}
```

### Advanced Filtering

```typescript
export class YourComponent {
  // Configure advanced filters
  advancedConfig: AutocompleteWrapperConfig = {
    ...this.baseConfig,
    enableAdvancedSearch: true,
    enableStockFilter: true,
    stockProperty: 'stock',
    searchFields: [
      { value: 'name', property: 'name', label: 'Name' },
      { value: 'category', property: 'category', label: 'Category' },
      { value: 'brand', property: 'brand', label: 'Brand' }
    ]
  };

  // Handle filter changes
  onFilterChanged(filters: AutocompleteWrapperFilters): void {
    console.log('Search by:', filters.searchBy);
    console.log('Stock filter:', filters.stockFilter);
    
    // Apply filters to your data or API call
    this.applyFilters(filters);
  }

  private applyFilters(filters: AutocompleteWrapperFilters): void {
    // Implementation for applying filters
  }
}
```

### Styling and Customization

```scss
// Custom styles for the autocomplete wrapper
.acp-autocomplete-wrapper {
  .search-input {
    border-radius: 8px;
    border: 2px solid #e0e0e0;
    
    &:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    }
  }

  .overlay {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e0e0e0;
  }

  .item {
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }

    &.selected {
      background-color: #e3f2fd;
    }
  }

  .history-section {
    background-color: #fafafa;
    border-bottom: 1px solid #e0e0e0;
  }

  .filters-section {
    padding: 8px 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }
}
```

### Component API

**Inputs:**

| Name                | Type                                    | Default | Description                                    |
| ------------------- | --------------------------------------- | ------- | ---------------------------------------------- |
| dataSource          | AutocompleteWrapperItem[]                | []      | Local data source for the autocomplete         |
| config              | AutocompleteWrapperConfig                | default | Configuration object for the component         |
| itemTemplate        | TemplateRef<any>                        | -       | Custom template for rendering items             |
| searchFunction      | AutocompleteWrapperSearchFunction        | -       | Function for remote search operations          |
| notFoundTemplate    | TemplateRef<any>                        | -       | Custom template for when no items are found    |
| overlayWidth        | string                                  | 'auto'  | Width of the dropdown overlay                  |
| overlayMaxHeight    | string                                  | '400px' | Maximum height of the dropdown overlay         |

**Outputs:**

| Name                | Type                                                                    | Description                                    |
| ------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| itemSelected        | AutocompleteWrapperItem                                                  | Emitted when an item is selected               |
| searchChanged       | string                                                                  | Emitted when the search query changes          |
| searchRequested     | { query: string; filters: AutocompleteWrapperFilters; page: number }    | Emitted when a search is requested             |
| pageChanged         | number                                                                  | Emitted when the page changes                  |
| filterChanged       | AutocompleteWrapperFilters                                               | Emitted when filters change                    |
| advancedSearchClicked| void                                                                     | Emitted when advanced search is clicked        |
| allResultsClicked   | string                                                                  | Emitted when "all results" is clicked         |
| createClicked       | string                                                                  | Emitted when create option is clicked          |

**Configuration Interface:**

```typescript
interface AutocompleteWrapperConfig {
  minSearchLength?: number;
  itemsPerPage?: number;
  enableStockFilter?: boolean;
  stockProperty?: string;
  searchFields?: Array<{
    value: string;
    property: string;
    label: string;
  }>;
  defaultSearchField?: string;
  enableHistory?: boolean;
  maxHistoryItems?: number;
  enableAdvancedSearch?: boolean;
  enableCreateOption?: boolean;
  createOptionText?: string;
  notFoundText?: string;
  loadingText?: string;
  placeholder?: string;
}
```

**Example Screenshot:**

![AutocompleteWrapper Example](../assets/images/autocomplete-wrapper-example.png)

_Note: The actual appearance may vary based on your application's theme and custom styling._
