# @acontplus/utils

Utility library for AcontPlus applications, providing converters, formatters, helpers, validators, and error classes.

## Installation

```bash
npm install @acontplus/utils
```

## Features

- **Converters**: Color, decimal, and JSON conversion utilities
- **Formatters**: Date, number, and string formatting functions
- **Helpers**: Array, field, and object manipulation helpers
- **Validators**: Parameter and regex validation utilities
- **Error Classes**: Custom error types like InvalidParameterError
- **Type Definitions**: TypeScript types for dates and other utilities
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Converters

### Color Converter

Utilities for color manipulation and conversion.

### Decimal Converter

Decimal number conversion and handling.

### JSON Converter

JSON serialization and deserialization utilities.

## Formatters

### Date Formatter

Date formatting and parsing utilities.

### Number Formatter

Number formatting functions.

### String Formatter

String manipulation and formatting.

## Helpers

### Array Helper

Array manipulation utilities.

### Field Helper

Field-related helper functions.

### Object Helper

Object manipulation and utility functions.

## Validators

### Parameter Validator

Parameter validation utilities.

### Regex Validator

Regular expression validation.

## Error Classes

### InvalidParameterError

Custom error for invalid parameters.

## Usage

Import the utilities you need:

```typescript
import { ColorConverter, DateFormatter, ArrayHelper } from '@acontplus/utils';

// Convert colors
const hex = ColorConverter.rgbToHex(255, 0, 0);

// Format dates
const formatted = DateFormatter.format(new Date(), 'YYYY-MM-DD');

// Manipulate arrays
const unique = ArrayHelper.unique([1, 2, 2, 3]);
```

## Running unit tests

Run `nx test utils` to execute the unit tests.
