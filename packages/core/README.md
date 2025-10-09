# @acontplus/core

Core library for AcontPlus applications, providing essential utilities and functionalities for business logic, calculations, and configuration management.

## Installation

```bash
npm install @acontplus/core
```

## Features

- **Pricing Calculations**: Comprehensive pricing utilities including discount calculators, line item calculators, pricing calculators, profit calculators, and tax calculators
- **Constants**: Predefined constants for SRI (Servicio de Rentas Internas) document types and separators
- **Environment Configuration**: Type-safe environment configuration interfaces
- **Models & Value Objects**: Domain models and value objects for business entities
- **Ports & Adapters**: Clean architecture patterns with ports and adapters for external integrations
- **Type Definitions**: Comprehensive TypeScript type definitions for type safety

## Usage

### Pricing Calculations

```typescript
import { DiscountCalculator, TaxCalculator, PricingCalculator } from '@acontplus/core';

// Calculate discounts
const discountCalc = new DiscountCalculator();
const discount = discountCalc.calculate(100, 10); // 10% discount on $100

// Calculate taxes
const taxCalc = new TaxCalculator();
const tax = taxCalc.calculate(100, 0.12); // 12% tax on $100

// Complex pricing calculations
const pricingCalc = new PricingCalculator();
const finalPrice = pricingCalc.calculateTotal(items, discounts, taxes);
```

### Constants

```typescript
import { SRI_DOCUMENT_TYPE, SEPARATOR_KEY_CODE } from '@acontplus/core';

// Use SRI document types for Ecuadorian tax system
const documentType = SRI_DOCUMENT_TYPE.RUC; // '04'

// Use separator constants
const separator = SEPARATOR_KEY_CODE.SLASH; // '|'
```

### Environment Configuration

```typescript
import { Environment } from '@acontplus/core';

const environment: Environment = {
  apiBaseUrl: 'https://api.example.com',
  isProduction: false,
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  clientId: 'your-client-id',
  loginRoute: 'login',
};
```
