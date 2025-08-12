# UI Component API Documentation

This document provides detailed API documentation for all UI components in the `acontplus-ui-components` library, including inputs, outputs, methods, and interfaces.

## Table of Contents

- [Cards](#cards)
  - [MatDynamicCardComponent](#matdynamiccardcomponent)
- [Dialog Wrapper](#dialog-wrapper)
  - [DialogWrapperComponent](#dialogwrappercomponent)
  - [AdvancedDialogService](#advanceddialogservice)
  - [DialogWrapperConfig](#dialogwrapperconfig)
  - [MatCustomDialogConfig](#matcustomdialogconfig)
- [Icons](#icons)
  - [SvgIconComponent](#svgiconcomponent)
  - [IconUserComponent](#iconusercomponent)
- [Mat Input Chip](#mat-input-chip)
  - [MatInputChipComponent](#matinputchipcomponent)
- [Mat Theme Button](#mat-theme-button)
  - [MatThemeButtonComponent](#matthemebuttoncomponent)
- [Snackbar](#snackbar)
  - [SnackbarNotificationComponent](#snackbarnotificationcomponent)
- [Spinner](#spinner)
  - [SpinnerComponent](#spinnercomponent)
- [Tables](#tables)
  - [MatDynamicTableComponent](#matdynamictablecomponent)
  - [CustomTabulatorComponent](#customtabulatorcomponent)
- [Theme Toggle](#theme-toggle)
  - [ThemeToggleComponent](#themetogglecomponent)
- [Autocomplete Wrapper](#autocomplete-wrapper)
  - [AutocompleteWrapperComponent](#autocompletewrappercomponent)
  - [AutocompleteWrapperService](#autocompletewrapperservice)

## Cards

### MatDynamicCardComponent

A versatile card component that wraps Angular Material's `mat-card` with additional functionality and customization options.

**Selector:** `acp-mat-dynamic-card`

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

**Methods:**

| Name                       | Parameters   | Return Type | Description                              |
| -------------------------- | ------------ | ----------- | ---------------------------------------- |
| handlePrimaryButtonClick   | event: Event | void        | Handles the primary button click event   |
| handleSecondaryButtonClick | event: Event | void        | Handles the secondary button click event |
| handleCardClick            | event: Event | void        | Handles the card click event             |

## Dialog Wrapper

### DialogWrapperComponent

A wrapper component for Angular Material dialogs that provides a consistent look and feel, including a draggable header and the ability to dynamically create components inside the dialog.

**Selector:** `acp-dialog-wrapper`

**Inputs:**

| Name   | Type                | Description                          |
| ------ | ------------------- | ------------------------------------ |
| config | DialogWrapperConfig | Configuration for the dialog wrapper |

**ViewChild:**

| Name         | Type             | Description                                                     |
| ------------ | ---------------- | --------------------------------------------------------------- |
| contentHost  | ViewContainerRef | A template reference that acts as an anchor for dynamic content |
| dialogHeader | ElementRef       | A reference to the header element for the z-index focus logic   |

**Methods:**

| Name            | Parameters | Return Type | Description                                             |
| --------------- | ---------- | ----------- | ------------------------------------------------------- |
| ngAfterViewInit | none       | void        | Lifecycle hook that initializes the dynamic content     |
| onClose         | none       | void        | Closes the dialog                                       |
| bringToFront    | none       | void        | Brings the dialog to the front by adjusting its z-index |

### AdvancedDialogService

A service for opening dialogs with advanced configuration options.

**Methods:**

| Name             | Parameters                                                                            | Return Type                                      | Description                                                        |
| ---------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| open             | component: ComponentType<T>, config: MatCustomDialogConfig<D> = {}                    | Promise<MatDialogRef<T, R>>                      | Opens a component in a dialog                                      |
| openInWrapper    | wrapperConfig: DialogWrapperConfig<T>, matDialogConfig: MatCustomDialogConfig<T> = {} | Promise<MatDialogRef<DialogWrapperComponent, R>> | Opens a component inside the dialog wrapper                        |
| openAndGetResult | component: ComponentType<T>, config: MatCustomDialogConfig<D> = {}                    | Promise<R \| undefined>                          | Opens a dialog and returns a promise that resolves with the result |
| closeAll         | none                                                                                  | void                                             | Closes all open dialogs                                            |

### DialogWrapperConfig

Configuration interface for the dialog wrapper.

**Properties:**

| Name       | Type      | Required | Description                                 |
| ---------- | --------- | -------- | ------------------------------------------- |
| component  | Type<any> | Yes      | The component to render inside the dialog   |
| title      | string    | Yes      | The title to display in the dialog header   |
| icon       | string    | No       | Material icon name to display in the header |
| data       | any       | No       | Data to pass to the content component       |
| hideHeader | boolean   | No       | Whether to hide the dialog header           |

### MatCustomDialogConfig

Configuration interface for Material dialogs with additional options.

**Properties:**

| Name                   | Type                                                             | Description                                                                       |
| ---------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| data                   | any                                                              | Data to pass to the dialog component                                              |
| size                   | DialogSize                                                       | Predefined size for the dialog ('xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full')      |
| width                  | string                                                           | Custom width for the dialog                                                       |
| height                 | string                                                           | Custom height for the dialog                                                      |
| minWidth               | string                                                           | Minimum width for the dialog                                                      |
| minHeight              | string                                                           | Minimum height for the dialog                                                     |
| maxWidth               | string                                                           | Maximum width for the dialog                                                      |
| maxHeight              | string                                                           | Maximum height for the dialog                                                     |
| position               | { top?: string; bottom?: string; left?: string; right?: string } | Custom position for the dialog                                                    |
| panelClass             | string \| string[]                                               | CSS class(es) to add to the dialog container                                      |
| backdropClass          | string \| string[]                                               | CSS class(es) to add to the backdrop                                              |
| hasBackdrop            | boolean                                                          | Whether to show a backdrop                                                        |
| backdropClickClosable  | boolean                                                          | Whether clicking the backdrop closes the dialog                                   |
| escapeKeyClosable      | boolean                                                          | Whether pressing escape closes the dialog                                         |
| isMobileFullScreen     | boolean                                                          | Whether to make the dialog fullscreen on mobile devices                           |
| autoFocus              | boolean \| 'first-tabbable' \| 'dialog' \| 'first-heading'       | Element to focus when the dialog opens                                            |
| restoreFocus           | boolean                                                          | Whether to restore focus to the previously focused element when the dialog closes |
| ariaLabel              | string                                                           | ARIA label for the dialog                                                         |
| ariaLabelledBy         | string                                                           | ID of the element that labels the dialog                                          |
| ariaDescribedBy        | string                                                           | ID of the element that describes the dialog                                       |
| role                   | 'dialog' \| 'alertdialog'                                        | ARIA role for the dialog                                                          |
| scrollStrategy         | ScrollStrategy                                                   | Strategy for handling scrolling while the dialog is open                          |
| enterAnimationDuration | number \| string                                                 | Duration of the enter animation                                                   |
| exitAnimationDuration  | number \| string                                                 | Duration of the exit animation                                                    |

## Icons

### SvgIconComponent

A component for displaying SVG icons with customizable styling.

**Selector:** `acp-svg-icon`

**Inputs:**

| Name  | Type   | Default | Description                    |
| ----- | ------ | ------- | ------------------------------ |
| icon  | string | -       | The SVG icon content to render |
| size  | string | '24px'  | Size of the icon               |
| color | string | -       | Color of the icon              |

### IconUserComponent

A user icon component with customizable appearance.

**Selector:** `acp-icon-user`

**Inputs:**

| Name  | Type   | Default | Description                    |
| ----- | ------ | ------- | ------------------------------ |
| size  | string | '24px'  | Size of the icon               |
| color | string | -       | Color of the icon              |

## Mat Input Chip

### MatInputChipComponent

A chip component that integrates with Angular Material's chip list.

**Selector:** `acp-mat-input-chip`

**Inputs:**

| Name      | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| value     | string | -       | The value of the chip          |
| removable | boolean| true    | Whether the chip can be removed |

**Outputs:**

| Name      | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| removed   | string | Emitted when the chip is removed |

## Mat Theme Button

### MatThemeButtonComponent

A theme-aware button component that adapts to the current theme.

**Selector:** `acp-mat-theme-button`

**Inputs:**

| Name      | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| text      | string | -       | Button text                    |
| icon      | string | -       | Material icon name             |
| variant   | 'primary' \| 'secondary' \| 'warn' | 'primary' | Button variant |

## Snackbar

### SnackbarNotificationComponent

A notification component for displaying snackbar messages.

**Selector:** `acp-snackbar-notification`

**Inputs:**

| Name      | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| message   | string | -       | The notification message       |
| type      | 'success' \| 'error' \| 'warning' \| 'info' | 'info' | Message type |
| duration  | number | 3000    | Display duration in milliseconds |

## Spinner

### SpinnerComponent

A loading spinner component with customizable appearance.

**Selector:** `acp-spinner`

**Inputs:**

| Name      | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| size      | string | '24px'  | Size of the spinner            |
| color     | string | -       | Color of the spinner           |
| overlay   | boolean| false   | Whether to show overlay        |

## Tables

### MatDynamicTableComponent

A dynamic table component built on Angular Material.

**Selector:** `acp-mat-dynamic-table`

**Inputs:**

| Name      | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| data      | any[]  | []      | Table data                     |
| columns   | ColumnDefinition[] | [] | Column definitions            |
| pagination| PaginationConfig | null | Pagination configuration |

### CustomTabulatorComponent

A table component using Tabulator library for advanced table features.

**Selector:** `acp-custom-tabulator`

**Inputs:**

| Name      | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| data      | any[]  | []      | Table data                     |
| options   | TabulatorOptions | {} | Tabulator configuration options |

## Theme Toggle

### ThemeToggleComponent

A component for switching between light and dark themes.

**Selector:** `acp-theme-toggle`

**Inputs:**

| Name      | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| showLabel | boolean| true    | Whether to show the theme label |

**Outputs:**

| Name      | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| themeChanged | 'light' \| 'dark' | Emitted when theme changes |

## Autocomplete Wrapper

### AutocompleteWrapperComponent

A powerful, feature-rich autocomplete component that provides advanced search capabilities, local and remote data handling, and customizable filtering options.

**Selector:** `acp-autocomplete-wrapper`

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

**ViewChild:**

| Name                | Type             | Description                                    |
| ------------------- | ---------------- | ---------------------------------------------- |
| searchInput         | ElementRef       | Reference to the search input element          |
| historyListElement  | ElementRef       | Reference to the history list element          |
| resultsListElement  | ElementRef       | Reference to the results list element          |

**Methods:**

| Name                | Parameters | Return Type | Description                                    |
| ------------------- | ---------- | ----------- | ---------------------------------------------- |
| ngOnInit            | none       | void        | Lifecycle hook that initializes the component |
| ngOnDestroy         | none       | void        | Lifecycle hook that cleans up subscriptions   |
| onInputFocus        | none       | void        | Handles input focus events                     |
| onInputBlur        | none       | void        | Handles input blur events                      |
| onInputChange      | event: Event | void      | Handles input change events                    |
| onInputKeyDown      | event: KeyboardEvent | void | Handles keyboard navigation                    |
| onItemClick        | item: AutocompleteWrapperItem | void | Handles item selection                        |
| onHistoryItemClick | item: AutocompleteWrapperItem | void | Handles history item selection                |
| onAdvancedSearchClick | none | void | Handles advanced search button click          |
| onAllResultsClick  | none       | void        | Handles "all results" button click            |
| onCreateClick      | none       | void        | Handles create option button click            |
| onFilterChange     | filters: AutocompleteWrapperFilters | void | Handles filter changes                        |
| onPageChange       | page: number | void      | Handles page changes                          |
| closeOverlay       | none       | void        | Closes the dropdown overlay                    |
| openOverlay        | none       | void        | Opens the dropdown overlay                     |

### AutocompleteWrapperService

A service that provides utility methods for autocomplete operations, including local search, filtering, and history management.

**Methods:**

| Name                | Parameters                                                                                    | Return Type                                    | Description                                    |
| ------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| searchLocal         | items: AutocompleteWrapperItem[], query: string, filters: AutocompleteWrapperFilters, config: AutocompleteWrapperConfig | Observable<AutocompleteWrapperSearchResult> | Performs local search on provided items        |
| searchAsync         | items: AutocompleteWrapperItem[], query: string, filters: AutocompleteWrapperFilters, config: AutocompleteWrapperConfig | Observable<AutocompleteWrapperItem[]>        | Simulates async search with delay              |
| filterItems         | items: AutocompleteWrapperItem[], query: string, filters: AutocompleteWrapperFilters, config: AutocompleteWrapperConfig | AutocompleteWrapperItem[]                     | Filters items based on query and filters       |
| addToHistory        | item: AutocompleteWrapperItem | void                                           | Adds an item to search history                 |
| getHistory          | none       | Observable<AutocompleteWrapperItem[]>          | Gets the current search history                |
| clearHistory        | none       | void                                           | Clears the search history                      |
| loadHistoryFromStorage | none | void                                           | Loads history from local storage               |
| saveHistoryToStorage | none | void                                           | Saves history to local storage                 |

**Interfaces:**

```typescript
interface AutocompleteWrapperItem {
  id: number | string;
  [key: string]: any;
}

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

interface AutocompleteWrapperFilters {
  searchBy: string;
  stockFilter: 'all' | 'with-stock' | 'out-of-stock';
}

interface AutocompleteWrapperSearchFunction {
  (query: string, filters: AutocompleteWrapperFilters, page: number): Observable<AutocompleteWrapperSearchResult>;
}

interface AutocompleteWrapperSearchResult {
  items: AutocompleteWrapperItem[];
  totalCount: number;
  hasMore: boolean;
}

interface AutocompleteWrapperState {
  query: string;
  isLoading: boolean;
  overlayOpen: boolean;
  selectedIndex: number;
  currentPage: number;
  filteredItems: AutocompleteWrapperItem[];
  historyList: AutocompleteWrapperItem[];
  totalCount: number;
}
```

---

For detailed usage examples, see the [Component Examples](component-examples.md) documentation.
