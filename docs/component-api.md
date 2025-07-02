# UI Component API Documentation

This document provides detailed API documentation for all UI components in the acontplus-ui-components library, including inputs, outputs, methods, and interfaces.

## Table of Contents

- [Cards](#cards)
  - [MatDynamicCardComponent](#matdynamiccardcomponent)
- [Dialog Wrapper](#dialog-wrapper)
  - [DialogWrapperComponent](#dialogwrappercomponent)
  - [AdvancedDialogService](#advanceddialogservice)
  - [DialogWrapperConfig](#dialogwrapperconfig)
  - [MatCustomDialogConfig](#matcustomdialogconfig)
- [Icons](#icons)
- [Mat Input Chip](#mat-input-chip)
- [Mat Theme Button](#mat-theme-button)
- [Snackbar](#snackbar)
- [Spinner](#spinner)
- [Tables](#tables)
- [Theme Toggle](#theme-toggle)

## Cards

### MatDynamicCardComponent

A versatile card component that wraps Angular Material's `mat-card` with additional functionality and customization options.

**Selector:** `acp-mat-dynamic-card`

**Inputs:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| cardTitle | string \| null | null | The title text for the card header |
| cardSubtitle | string \| null | null | The subtitle text for the card header |
| avatarImageUrl | string \| null | null | URL for the avatar image in the card header |
| isHeaderVisible | boolean | false | Whether to show the card header |
| contentPadding | string | '1rem' | CSS padding value for the card content |
| hasDivider | boolean | false | Whether to show a divider between header and content |
| areActionsVisible | boolean | false | Whether to show the action buttons |
| primaryButtonText | string | 'Confirm' | Text for the primary action button |
| secondaryButtonText | string | 'Cancel' | Text for the secondary action button |
| primaryButtonIcon | string \| null | null | Material icon name for the primary button |
| secondaryButtonIcon | string \| null | null | Material icon name for the secondary button |
| buttonsPosition | 'start' \| 'end' | 'end' | Alignment of the action buttons |

**Outputs:**

| Name | Type | Description |
|------|------|-------------|
| primaryButtonClicked | void | Emitted when the primary button is clicked |
| secondaryButtonClicked | void | Emitted when the secondary button is clicked |
| cardClicked | Event | Emitted when the card is clicked |

**Methods:**

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| handlePrimaryButtonClick | event: Event | void | Handles the primary button click event |
| handleSecondaryButtonClick | event: Event | void | Handles the secondary button click event |
| handleCardClick | event: Event | void | Handles the card click event |

## Dialog Wrapper

### DialogWrapperComponent

A wrapper component for Angular Material dialogs that provides a consistent look and feel, including a draggable header and the ability to dynamically create components inside the dialog.

**Selector:** `acp-dialog-wrapper`

**Inputs:**

| Name | Type | Description |
|------|------|-------------|
| config | DialogWrapperConfig | Configuration for the dialog wrapper |

**ViewChild:**

| Name | Type | Description |
|------|------|-------------|
| contentHost | ViewContainerRef | A template reference that acts as an anchor for dynamic content |
| dialogHeader | ElementRef | A reference to the header element for the z-index focus logic |

**Methods:**

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| ngAfterViewInit | none | void | Lifecycle hook that initializes the dynamic content |
| onClose | none | void | Closes the dialog |
| bringToFront | none | void | Brings the dialog to the front by adjusting its z-index |

### AdvancedDialogService

A service for opening dialogs with advanced configuration options.

**Methods:**

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| open | component: ComponentType<T>, config: MatCustomDialogConfig<D> = {} | Promise<MatDialogRef<T, R>> | Opens a component in a dialog |
| openInWrapper | wrapperConfig: DialogWrapperConfig<T>, matDialogConfig: MatCustomDialogConfig<T> = {} | Promise<MatDialogRef<DialogWrapperComponent, R>> | Opens a component inside the dialog wrapper |
| openAndGetResult | component: ComponentType<T>, config: MatCustomDialogConfig<D> = {} | Promise<R \| undefined> | Opens a dialog and returns a promise that resolves with the result |
| closeAll | none | void | Closes all open dialogs |

### DialogWrapperConfig

Configuration interface for the dialog wrapper.

**Properties:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| component | Type<any> | Yes | The component to render inside the dialog |
| title | string | Yes | The title to display in the dialog header |
| icon | string | No | Material icon name to display in the header |
| data | any | No | Data to pass to the content component |
| hideHeader | boolean | No | Whether to hide the dialog header |

### MatCustomDialogConfig

Configuration interface for Material dialogs with additional options.

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| data | any | Data to pass to the dialog component |
| size | DialogSize | Predefined size for the dialog ('xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full') |
| width | string | Custom width for the dialog |
| height | string | Custom height for the dialog |
| minWidth | string | Minimum width for the dialog |
| minHeight | string | Minimum height for the dialog |
| maxWidth | string | Maximum width for the dialog |
| maxHeight | string | Maximum height for the dialog |
| position | { top?: string; bottom?: string; left?: string; right?: string } | Custom position for the dialog |
| panelClass | string \| string[] | CSS class(es) to add to the dialog container |
| backdropClass | string \| string[] | CSS class(es) to add to the backdrop |
| hasBackdrop | boolean | Whether to show a backdrop |
| backdropClickClosable | boolean | Whether clicking the backdrop closes the dialog |
| escapeKeyClosable | boolean | Whether pressing escape closes the dialog |
| isMobileFullScreen | boolean | Whether to make the dialog fullscreen on mobile devices |
| autoFocus | boolean \| 'first-tabbable' \| 'dialog' \| 'first-heading' | Element to focus when the dialog opens |
| restoreFocus | boolean | Whether to restore focus to the previously focused element when the dialog closes |
| ariaLabel | string | ARIA label for the dialog |
| ariaLabelledBy | string | ID of the element that labels the dialog |
| ariaDescribedBy | string | ID of the element that describes the dialog |
| role | 'dialog' \| 'alertdialog' | ARIA role for the dialog |
| scrollStrategy | ScrollStrategy | Strategy for handling scrolling while the dialog is open |
| enterAnimationDuration | number \| string | Duration of the enter animation |
| exitAnimationDuration | number \| string | Duration of the exit animation |