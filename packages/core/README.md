# @acontplus/core

Core library for AcontPlus applications, providing essential utilities, domain models, clean architecture patterns, and business logic components following Domain-Driven Design (DDD) principles.

## Installation

```bash
npm install @acontplus/core
```

## Features

- **Clean Architecture**: Ports and adapters pattern for external integrations
- **Domain Models**: Base entities, value objects, and domain-specific models
- **Pricing Engine**: Comprehensive pricing calculations with discount, tax, profit, and line item calculators
- **HTTP Adapters**: Axios and Fetch adapters with HTTP client factory
- **Use Cases**: Base use case pattern for business logic encapsulation
- **Value Objects**: Money, EntityId, IdentificationNumber, and AuthTokens value objects
- **Environment Configuration**: Type-safe environment configuration interfaces
- **Constants**: Application constants including SRI document types
- **Type Definitions**: Comprehensive TypeScript type definitions for pricing and business logic

## Architecture

This library follows Clean Architecture principles with clear separation of concerns:

- **Adapters**: External service integrations (HTTP clients)
- **Ports**: Interfaces for external dependencies
- **Models**: Domain entities and data transfer objects
- **Value Objects**: Immutable objects representing domain concepts
- **Use Cases**: Business logic encapsulation
- **Types**: TypeScript definitions for type safety

## Usage

### HTTP Adapters

```typescript
import { HttpClientFactory, AxiosAdapter, FetchAdapter } from '@acontplus/core';

// Create HTTP client with Axios
const axiosClient = HttpClientFactory.create('axios');

// Create HTTP client with Fetch
const fetchClient = HttpClientFactory.create('fetch');

// Use adapter directly
const axiosAdapter = new AxiosAdapter();
const response = await axiosAdapter.get('https://api.example.com/data');
```

### Pricing Calculations

```typescript
import {
  DiscountCalculator,
  TaxCalculator,
  PricingCalculator,
  ProfitCalculator,
  LineItemCalculator,
} from '@acontplus/core';

// Calculate discounts
const discountCalc = new DiscountCalculator();
const discount = discountCalc.calculate(100, 10); // 10% discount on $100

// Calculate taxes
const taxCalc = new TaxCalculator();
const tax = taxCalc.calculate(100, 0.12); // 12% tax on $100

// Calculate profit margins
const profitCalc = new ProfitCalculator();
const profit = profitCalc.calculate(cost, sellingPrice);

// Line item calculations
const lineItemCalc = new LineItemCalculator();
const lineTotal = lineItemCalc.calculate(quantity, unitPrice, discount, tax);

// Complex pricing calculations
const pricingCalc = new PricingCalculator();
const finalPrice = pricingCalc.calculateTotal(items, discounts, taxes);
```

### Value Objects

```typescript
import { Money, EntityId, IdentificationNumber, AuthTokens } from '@acontplus/core';

// Money value object for financial calculations
const price = new Money(99.99, 'USD');
const discountedPrice = price.subtract(new Money(10.0, 'USD'));

// Entity ID for domain entities
const customerId = new EntityId(12345);

// Identification number with validation
const ecuadorianId = new IdentificationNumber('1234567890');

// Authentication tokens
const tokens = new AuthTokens('access_token', 'refresh_token');
```

### Domain Models

```typescript
import { BaseEntity, ApiResponse, PaginatedResult } from '@acontplus/core';

// Base entity for domain objects
class Customer extends BaseEntity {
  constructor(
    id: number,
    public readonly name: string,
    public readonly email: string,
  ) {
    super(id);
  }
}

// API response handling
const response: ApiResponse<Customer> = {
  success: true,
  data: customer,
  message: 'Customer retrieved successfully',
};

// Paginated results
const paginatedCustomers: PaginatedResult<Customer> = {
  items: customers,
  totalCount: 100,
  pageSize: 10,
  currentPage: 1,
};
```

### Use Cases

```typescript
import { UseCase } from '@acontplus/core';

// Business logic encapsulation
class CreateCustomerUseCase extends UseCase<CreateCustomerRequest, Customer> {
  constructor(private customerRepository: CustomerRepository) {
    super();
  }

  async execute(request: CreateCustomerRequest): Promise<Customer> {
    // Validate business rules
    this.validateRequest(request);

    // Execute business logic
    return await this.customerRepository.create(request);
  }

  private validateRequest(request: CreateCustomerRequest): void {
    if (!request.name || request.name.trim().length === 0) {
      throw new Error('Customer name is required');
    }
  }
}
```

### Constants

```typescript
import { APP_CONSTANTS } from '@acontplus/core';

// Application constants
const maxRetries = APP_CONSTANTS.MAX_RETRY_ATTEMPTS;
const timeout = APP_CONSTANTS.DEFAULT_TIMEOUT;
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

### Pricing Types

```typescript
import { PricingTypes } from '@acontplus/core';

// Type-safe pricing calculations
const calculation: PricingTypes.PricingCalculation = {
  basePrice: 100,
  discounts: [{ type: 'percentage', value: 10 }],
  taxes: [{ type: 'percentage', value: 8.25 }],
  finalPrice: 97.43,
};
```
