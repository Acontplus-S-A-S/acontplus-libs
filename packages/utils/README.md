# @acontplus/utils

Comprehensive utility library providing converters, formatters, helpers, validators, and error classes for TypeScript/JavaScript applications.

## Installation

```bash
# Using npm
npm install @acontplus/utils

# Using pnpm
pnpm add @acontplus/utils
```

## Features

- **Converters**: Color, decimal, and JSON conversion utilities
- **Formatters**: Date, number, and string formatting functions
- **Helpers**: Array, field, and object manipulation utilities
- **Validators**: Parameter and regex validation functions
- **Error Classes**: Custom error types for better error handling
- **Models**: Decimal options and configuration interfaces
- **Type Definitions**: Comprehensive TypeScript type definitions including date types
- **Lightweight**: Minimal external dependencies for optimal bundle size

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

High-precision decimal operations using decimal.js for financial and scientific calculations:

```typescript
import { DecimalConverter, DecimalError } from '@acontplus/utils';

// Configuration
DecimalConverter.configure({
  precision: 6,
  returnAsNumber: true,
  throwOnInfinity: false,
});

// Basic operations
const sum = DecimalConverter.add(0.1, 0.2); // 0.3 (precise)
const difference = DecimalConverter.subtract(1.0, 0.9); // 0.1 (precise)
const product = DecimalConverter.multiply(0.1, 3); // 0.3 (precise)
const quotient = DecimalConverter.divide(1, 3, { precision: 4 }); // 0.3333

// Mathematical operations
const power = DecimalConverter.power(2, 3); // 8
const sqrt = DecimalConverter.sqrt(16); // 4
const absolute = DecimalConverter.abs(-5.5); // 5.5

// Financial operations
const price = 1000;
const discounted = DecimalConverter.applyDiscount(price, 15); // 850
const withTax = DecimalConverter.addTax(discounted, 16); // 986
const percentage = DecimalConverter.percentage(1000, 8.5); // 85

// Interest calculations
const simpleInterest = DecimalConverter.simpleInterest(1000, 5, 2); // 100
const compoundInterest = DecimalConverter.compoundInterest(1000, 5, 2, 12); // 105.12

// Array operations
const values = [0.1, 0.2, 0.3, 0.4, 0.5];
const total = DecimalConverter.sum(values); // 1.5
const average = DecimalConverter.average(values); // 0.3
const median = DecimalConverter.median(values); // 0.3
const min = DecimalConverter.min(values); // 0.1
const max = DecimalConverter.max(values); // 0.5

// Comparisons
const isEqual = DecimalConverter.equals(0.1 + 0.2, 0.3); // true
const isGreater = DecimalConverter.greaterThan(0.3, 0.2); // true
const comparison = DecimalConverter.compare(0.1, 0.2); // -1

// Chain operations
const result = DecimalConverter.chain(1000)
  .applyDiscount(10) // 900
  .addTax(16) // 1044
  .round(2) // 1044.00
  .toNumber(); // 1044

// Formatting
const formatted = DecimalConverter.format(1234.5678, {
  precision: 2,
  thousandsSeparator: ',',
  decimalSeparator: '.',
  prefix: '$',
  suffix: ' USD',
}); // "$1,234.57 USD"

// Error handling
try {
  const division = DecimalConverter.divide(10, 0);
} catch (error) {
  if (error instanceof DecimalError) {
    console.log(`Error in ${error.operation}: ${error.message}`);
  }
}

// Operation history with chains
const chain = DecimalConverter.chain(100).multiply(1.16).subtract(50).round(2);

console.log(chain.getOperationHistory());
// ["Started with: 100", "Multiplied by: 1.16", "Subtracted: 50", "Rounded to 2 decimal places"]
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

### E-commerce Price Calculator with DecimalConverter

```typescript
import { DecimalConverter, DecimalError } from '@acontplus/utils';

class PriceCalculator {
  calculateTotal(
    basePrice: number,
    taxRate: number,
    discountPercent: number = 0,
    shippingCost: number = 0,
  ): {
    subtotal: number;
    discount: number;
    taxAmount: number;
    shipping: number;
    total: number;
    formatted: string;
  } {
    try {
      // Use chain operations for complex calculations
      const calculation = DecimalConverter.chain(basePrice)
        .applyDiscount(discountPercent)
        .addTax(taxRate)
        .add(shippingCost);

      const subtotal = DecimalConverter.applyDiscount(basePrice, discountPercent);
      const discount = DecimalConverter.percentage(basePrice, discountPercent);
      const taxAmount = DecimalConverter.percentage(subtotal, taxRate);
      const total = calculation.toNumber();

      return {
        subtotal: subtotal as number,
        discount: discount as number,
        taxAmount: taxAmount as number,
        shipping: shippingCost,
        total,
        formatted: DecimalConverter.format(total, {
          prefix: '$',
          precision: 2,
          thousandsSeparator: ',',
        }),
      };
    } catch (error) {
      if (error instanceof DecimalError) {
        throw new Error(`Price calculation failed: ${error.message}`);
      }
      throw error;
    }
  }

  calculateBulkDiscount(quantity: number, unitPrice: number): number {
    if (quantity >= 100) return 15; // 15% discount
    if (quantity >= 50) return 10; // 10% discount
    if (quantity >= 10) return 5; // 5% discount
    return 0;
  }
}

// Usage
const calculator = new PriceCalculator();
const result = calculator.calculateTotal(99.99, 8.25, 10, 5.99);
console.log(result);
// {
//   subtotal: 89.99,
//   discount: 10.00,
//   taxAmount: 7.42,
//   shipping: 5.99,
//   total: 103.40,
//   formatted: "$103.40"
// }
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
