# @acontplus/ng-customer

Angular customer management library for AcontPlus applications, providing components and services for customer CRUD operations following clean architecture principles.

## Installation

```bash
npm install @acontplus/ng-customer
```

## Features

- **Customer Components**: Customer card and add/edit components built with Angular Material
- **Clean Architecture**: Organized in domain, application, infrastructure, and presentation layers
- **Domain Models**: Customer entities and value objects
- **Use Cases**: Business logic for customer operations (create, read, update, delete)
- **Repositories**: Data access abstractions with concrete implementations
- **DTOs and Mappers**: Data transfer objects and mapping utilities
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions
- **Angular Material Integration**: Consistent UI components

## Components

### Customer Card

Display component for showing customer information in a card format.

### Customer Add/Edit

Form component for creating and editing customer details.

## Architecture

The library follows Clean Architecture principles:

- **Domain**: Core business logic, entities, and repository interfaces
- **Application**: Use cases and application services
- **Infrastructure**: Repository implementations, DTOs, mappers, and external integrations
- **UI**: Angular components and presentation logic

## Usage

Import the components and services you need:

```typescript
import { CustomerCardComponent, CustomerAddEditComponent } from '@acontplus/ng-customer';
```

## Running unit tests

Run `nx test ng-customer` to execute the unit tests.
