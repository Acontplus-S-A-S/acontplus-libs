# @acontplus/utils

Comprehensive utility library providing converters, formatters, helpers, validators, and error classes for TypeScript/JavaScript applications.

**Note:** `decimal.js` is included as a runtime dependency for decimal number operations.

## Installation

```bash
npm install @acontplus/utils
```

## Features

- **Converters**: Color, decimal, and JSON conversion utilities
- **Formatters**: Date, number, and string formatting functions
- **Helpers**: Array, field, and object manipulation utilities
- **Validators**: Parameter and regex validation functions
- **Error Classes**: Custom error types for better error handling
- **Type Definitions**: Comprehensive TypeScript type definitions
- **Zero Dependencies**: Lightweight with minimal external dependencies

## Quick Start

```typescript
import {
  getRandomHexColor,
  DateFormatter,
  ArrayHelper,
  NumberFormatter,
  StringFormatter,
} from '@acontplus/utils';

// Generate random colors
const hexColor = getRandomHexColor(); // "#a3b2c1"
const rgbaColor = getRandomColor(0.8); // "rgba(163, 178, 193, 0.8)"

// Format dates
const formatted = DateFormatter.toString(new Date(), 'yyyy-MM-dd HH:mm:ss');
const futureDate = DateFormatter.addDays(new Date(), 7);

// Array operations
const isEmpty = ArrayHelper.isEmpty([]); // true
const maxValue = ArrayHelper.max([1, 5, 3, 9, 2]); // 9

// Number formatting
const currency = NumberFormatter.formatCurrency(1234.56); // "$1,234.56"
const percentage = NumberFormatter.formatPercentage(0.85); // "85.00%"
```

## API Reference

### Converters

#### Color Converter

Generate random colors in different formats:

```typescript
import { getRandomHexColor, getRandomColor } from '@acontplus/utils';

// Generate random hex color
const hex = getRandomHexColor(); // "#ff5733"

// Generate random RGBA color with opacity
const rgba = getRandomColor(0.7); // "rgba(255, 87, 51, 0.7)"

// Usage in charts or UI components
const chartColors = Array.from({ length: 5 }, () => getRandomHexColor());
// ["#a1b2c3", "#d4e5f6", "#789abc", "#def012", "#345678"]
```

#### Decimal Converter

Precise decimal number operations using decimal.js:

```typescript
import { DecimalConverter } from '@acontplus/utils';

// Precise decimal calculations
const result = DecimalConverter.add(0.1, 0.2); // Decimal(0.3)
const price = DecimalConverter.multiply(19.99, 1.08); // Tax calculation
```

#### JSON Converter

Safe JSON operations with error handling:

```typescript
import { JsonConverter } from '@acontplus/utils';

// Safe JSON parsing
const data = JsonConverter.parse('{"name": "John"}', null);
// Returns parsed object or null if invalid

// Safe JSON stringification
const json = JsonConverter.stringify({ name: 'John' }, '{}');
// Returns JSON string or fallback if error
```

### Formatters

#### Date Formatter

Comprehensive date manipulation and formatting:

```typescript
import { DateFormatter } from '@acontplus/utils';

// Date arithmetic
const tomorrow = DateFormatter.addDays(new Date(), 1);
const nextMonth = DateFormatter.addMonths(new Date(), 1);
const nextYear = DateFormatter.addYears(new Date(), 1);

// Custom formatting
const formatted = DateFormatter.toString(new Date(), 'yyyy-MM-dd HH:mm:ss');
// "2024-01-15 14:30:45"

const shortDate = DateFormatter.toString(new Date(), 'dd/MM/yyyy');
// "15/01/2024"

// UTC formatting
const utcString = DateFormatter.toUTCString(new Date(), 'yyyy-MM-dd');

// Date comparisons
const isSameDay = DateFormatter.isSame(date1, date2, 'day');
const isSameYear = DateFormatter.isSame(date1, date2, 'year');

// Time range checking
const isInRange = DateFormatter.isInTimeRange(
  new Date(),
  { hour: 9, minute: 0, second: 0 },
  { hour: 17, minute: 30, second: 0 },
); // Business hours check

// Validation
const isValid = DateFormatter.isValid(new Date('invalid')); // false

// Utility functions
const today = DateFormatter.getToday(); // Today at 00:00:00
const timestamp = DateFormatter.dateToTimestamp(new Date());
const dateFromTimestamp = DateFormatter.timestampToDate(1640995200000);
```

#### Number Formatter

Number formatting and validation:

```typescript
import { NumberFormatter } from '@acontplus/utils';

// Currency formatting
const price = NumberFormatter.formatCurrency(1234.56, 'USD');
// "$1,234.56"

const euroPrice = NumberFormatter.formatCurrency(1234.56, 'EUR');
// "€1,234.56"

// Percentage formatting
const percentage = NumberFormatter.formatPercentage(0.8542, 2);
// "85.42%"

// Decimal operations
const rounded = NumberFormatter.roundToDecimals(3.14159, 2); // 3.14
const fixed = NumberFormatter.toFixed(3.14159, 2); // "3.14"

// Validation
const isInteger = NumberFormatter.isInteger(42); // true
const isSafe = NumberFormatter.isSafeInteger(Number.MAX_SAFE_INTEGER); // true

// Utility functions
const clamped = NumberFormatter.clamp(15, 0, 10); // 10
const comparison = NumberFormatter.compare(3.14159, 3.1416, 0.001); // 0 (equal within tolerance)
```

#### String Formatter

String manipulation and formatting utilities:

```typescript
import { StringFormatter } from '@acontplus/utils';

// Case transformations
const capitalized = StringFormatter.capitalize('hello world'); // "Hello world"
const titleCase = StringFormatter.capitalizeWords('hello world'); // "Hello World"

// URL-friendly strings
const slug = StringFormatter.slugify('Hello World! 123'); // "hello-world-123"

// Text truncation
const truncated = StringFormatter.truncate('Long text here', 10); // "Long te..."
const customTruncated = StringFormatter.truncate('Long text', 8, '…'); // "Long t…"

// Accent removal
const normalized = StringFormatter.removeAccents('café résumé'); // "cafe resume"

// Random string generation
const randomId = StringFormatter.generateRandomString(8); // "aB3xY9mK"

// Validation
const isEmpty = StringFormatter.isNullOrWhitespace('   '); // true
const hasContent = StringFormatter.isNullOrWhitespace('hello'); // false
```

### Helpers

#### Array Helper

Comprehensive array manipulation utilities:

```typescript
import { ArrayHelper } from '@acontplus/utils';

// Array validation
const isEmpty = ArrayHelper.isEmpty([]); // true
const hasItems = ArrayHelper.isNotEmpty([1, 2, 3]); // true

// Element checking
const contains = ArrayHelper.contains([1, 2, 3], 2); // true
const containsAny = ArrayHelper.containsAny([1, 2, 3], [3, 4, 5]); // true
const containsAll = ArrayHelper.containsAll([1, 2, 3], [1, 2]); // true

// Array modification
const numbers = [1, 3, 5];
ArrayHelper.insert(numbers, 1, 2); // [1, 2, 3, 5]
ArrayHelper.remove(numbers, 3); // [1, 2, 5]

// Mathematical operations
const maxValue = ArrayHelper.max([1, 5, 3, 9, 2]); // 9
const minValue = ArrayHelper.min([1, 5, 3, 9, 2]); // 1

// Array slicing
const firstThree = ArrayHelper.take([1, 2, 3, 4, 5], 3); // [1, 2, 3]
const lastTwo = ArrayHelper.takeRight([1, 2, 3, 4, 5], 2); // [4, 5]

// Practical examples
const users = [{ name: 'John' }, { name: 'Jane' }, { name: 'Bob' }];
const hasUsers = ArrayHelper.isNotEmpty(users);
const topUsers = ArrayHelper.take(users, 2);
```

#### Object Helper

Object manipulation and validation utilities:

```typescript
import { ObjectHelper } from '@acontplus/utils';

// Null/undefined checking
const isNull = ObjectHelper.isNullOrUndefined(null); // true
const isUndefined = ObjectHelper.isNullOrUndefined(undefined); // true
const hasValue = ObjectHelper.isNullOrUndefined('hello'); // false

// Type checking
const isArray = ObjectHelper.isArray([1, 2, 3]); // true
const isObject = ObjectHelper.isObject({ name: 'John' }); // true
const isString = ObjectHelper.isString('hello'); // true
const isNumber = ObjectHelper.isNumber(42); // true

// Practical usage in validation
function processUser(user: any) {
  if (ObjectHelper.isNullOrUndefined(user)) {
    throw new Error('User is required');
  }

  if (!ObjectHelper.isObject(user)) {
    throw new Error('User must be an object');
  }

  // Process user...
}
```

#### Field Helper

Field-specific utility functions:

```typescript
import { FieldHelper } from '@acontplus/utils';

// Field validation and manipulation
const isValidField = FieldHelper.isValid(fieldValue);
const processedField = FieldHelper.process(rawFieldData);
```

### Validators

#### Parameter Validator

Parameter validation utilities:

```typescript
import { ParameterValidator } from '@acontplus/utils';

// Parameter validation
const isValidParam = ParameterValidator.validate(parameter, rules);
const sanitizedParam = ParameterValidator.sanitize(userInput);

// Usage in functions
function calculatePrice(amount: number, taxRate: number) {
  if (!ParameterValidator.isValidNumber(amount)) {
    throw new InvalidParameterError('Amount must be a valid number');
  }

  if (!ParameterValidator.isValidRate(taxRate)) {
    throw new InvalidParameterError('Tax rate must be between 0 and 1');
  }

  return amount * (1 + taxRate);
}
```

#### Regex Validator

Regular expression validation utilities:

```typescript
import { RegexValidator } from '@acontplus/utils';

// Common validation patterns
const isEmail = RegexValidator.isEmail('user@example.com'); // true
const isPhone = RegexValidator.isPhone('+1-555-123-4567'); // true
const isUrl = RegexValidator.isUrl('https://example.com'); // true

// Custom pattern validation
const pattern = /^[A-Z]{2}\d{4}$/; // Two letters + four digits
const isValid = RegexValidator.test('AB1234', pattern); // true

// Form validation example
function validateForm(data: any) {
  const errors: string[] = [];

  if (!RegexValidator.isEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (!RegexValidator.isPhone(data.phone)) {
    errors.push('Invalid phone format');
  }

  return errors;
}
```

### Error Classes

#### InvalidParameterError

Custom error class for parameter validation:

```typescript
import { InvalidParameterError } from '@acontplus/utils';

// Throw specific parameter errors
function divide(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new InvalidParameterError('Both parameters must be numbers');
  }

  if (b === 0) {
    throw new InvalidParameterError('Division by zero is not allowed');
  }

  return a / b;
}

// Error handling
try {
  const result = divide(10, 0);
} catch (error) {
  if (error instanceof InvalidParameterError) {
    console.error('Parameter error:', error.message);
  }
}
```

### Type Definitions

#### Date Types

TypeScript interfaces for date-related operations:

```typescript
import { TIME_OF_DAY, HOUR_OF_DAY, MINUTE_OF_DAY, SECOND_OF_DAY } from '@acontplus/utils';

// Time range definitions
const businessHours: TIME_OF_DAY = {
  hour: 9,
  minute: 0,
  second: 0,
};

const closingTime: TIME_OF_DAY = {
  hour: 17,
  minute: 30,
  second: 0,
};

// Type-safe time operations
function isBusinessHours(date: Date): boolean {
  return DateFormatter.isInTimeRange(date, businessHours, closingTime);
}
```

## Real-World Examples

### E-commerce Price Calculator

```typescript
import { NumberFormatter, DecimalConverter } from '@acontplus/utils';

class PriceCalculator {
  calculateTotal(price: number, taxRate: number, discount: number = 0): string {
    // Use decimal converter for precise calculations
    const discountedPrice = DecimalConverter.multiply(price, 1 - discount);
    const taxAmount = DecimalConverter.multiply(discountedPrice, taxRate);
    const total = DecimalConverter.add(discountedPrice, taxAmount);

    // Format as currency
    return NumberFormatter.formatCurrency(total.toNumber(), 'USD');
  }
}

const calculator = new PriceCalculator();
const total = calculator.calculateTotal(99.99, 0.08, 0.1); // "$93.59"
```

### Form Validation System

```typescript
import {
  RegexValidator,
  StringFormatter,
  ObjectHelper,
  InvalidParameterError,
} from '@acontplus/utils';

class FormValidator {
  validateUser(userData: any): string[] {
    const errors: string[] = [];

    // Check if data exists
    if (ObjectHelper.isNullOrUndefined(userData)) {
      errors.push('User data is required');
      return errors;
    }

    // Validate email
    if (StringFormatter.isNullOrWhitespace(userData.email)) {
      errors.push('Email is required');
    } else if (!RegexValidator.isEmail(userData.email)) {
      errors.push('Invalid email format');
    }

    // Validate name
    if (StringFormatter.isNullOrWhitespace(userData.name)) {
      errors.push('Name is required');
    } else if (userData.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    return errors;
  }

  sanitizeInput(input: string): string {
    return StringFormatter.removeAccents(StringFormatter.capitalize(input.trim()));
  }
}
```

### Data Processing Pipeline

```typescript
import { ArrayHelper, DateFormatter, ObjectHelper } from '@acontplus/utils';

class DataProcessor {
  processUserData(users: any[]): any[] {
    // Validate input
    if (ArrayHelper.isEmpty(users)) {
      return [];
    }

    return users
      .filter(user => !ObjectHelper.isNullOrUndefined(user))
      .map(user => ({
        ...user,
        fullName: StringFormatter.capitalizeWords(user.name),
        joinDate: DateFormatter.toString(new Date(user.joinDate), 'yyyy-MM-dd'),
        isActive:
          user.lastLogin &&
          DateFormatter.compare(new Date(user.lastLogin), DateFormatter.addDays(new Date(), -30)) >
            0,
      }))
      .slice(0, 100); // Take first 100 using ArrayHelper.take could also work
  }
}
```
