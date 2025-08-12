# Test App - Domain-Driven Design (DDD) Architecture

A modern Angular application organized following Domain-Driven Design principles with clean architecture and consistent naming conventions.

## 🏗️ Project Structure

The project follows a layered architecture approach with clear separation of concerns:

```
src/app/
├── application/          # Application Layer
│   ├── commands/        # Command handlers (create, update, delete user)
│   ├── queries/         # Query handlers (user queries)
│   ├── use-cases/       # Use case implementations
│   └── index.ts         # Exports
├── constants/            # Application Constants
│   ├── app.constants.ts # App-specific constants
│   └── index.ts         # Exports
├── domain/              # Domain Layer
│   ├── user.ts          # User domain model
│   ├── product.ts       # Product domain model
│   └── index.ts         # Exports
├── data/                # Data Layer
│   ├── example-http.repository.ts # Example HTTP repository
│   ├── user-http.repository.ts    # User HTTP repository
│   ├── product-http.repository.ts # Product HTTP repository
│   └── index.ts         # Exports
├── providers/           # Providers Layer
│   ├── application.service.ts # Application service
│   ├── transloco-loader.ts    # Translation loader
│   └── index.ts         # Exports
├── ui/                  # UI Layer
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   └── index.ts         # Exports
├── shared/              # Shared Layer
│   └── index.ts         # Cross-cutting utilities
└── index.ts             # Main application exports
```

## 🏷️ Repository Naming Convention

We follow a clear naming convention for repositories to indicate their transport mechanism:

- **`-http.repository.ts`** - HTTP-based repositories (REST API calls)
- Future conventions could include:
  - **`-grpc.repository.ts`** - gRPC-based repositories
  - **`-websocket.repository.ts`** - WebSocket-based repositories
  - **`-local.repository.ts`** - Local storage repositories

### Why `-http` instead of `-web` or `-impl`?

1. **Clear Intent**: `-http` immediately tells developers this repository makes HTTP requests
2. **Technology Specific**: It's explicit about the transport mechanism (HTTP vs WebSocket, gRPC, etc.)
3. **Consistent with Industry Standards**: Many frameworks use similar naming (e.g., `HttpClient`, `HttpInterceptor`)
4. **Future-Proof**: If you later add other transport methods, you can have `-grpc`, `-websocket`, etc.

## 🎯 Layer Responsibilities

### Domain Layer
- Contains core business logic
- Defines entities, value objects, and domain models
- Independent of external concerns

### Application Layer
- Orchestrates domain objects
- Implements use cases
- Handles commands and queries
- Coordinates between layers

### Data Layer
- Implements data access patterns
- Contains repositories and data sources
- Handles external data integration
- **Repository Naming**: Uses `-http` suffix for HTTP-based repositories

### Providers Layer
- Provides application-wide services
- Implements interceptors and guards
- Manages cross-cutting concerns

### UI Layer
- Contains all user interface components
- Separates pages from reusable components
- Follows Angular component architecture

### Constants Layer
- Centralizes application constants
- Provides type-safe configuration
- Easy to maintain and update

### Shared Layer
- Contains cross-cutting utilities
- Implements reusable pipes and directives
- Shared across all layers

## 🔧 Benefits of This Architecture

1. **Clear Separation of Concerns**: Each layer has a specific responsibility
2. **Better Maintainability**: Code is organized logically and easy to navigate
3. **Improved Testability**: Layers can be tested independently
4. **Enhanced Scalability**: Easy to add new features without affecting existing code
5. **Team Collaboration**: Clear boundaries for team members to work on
6. **DDD Compliance**: Follows established Domain-Driven Design principles
7. **Clear Naming**: Repository naming convention makes transport mechanism obvious

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- Angular CLI (version 15 or higher)

### Installation
```bash
npm install
```

### Development Server
```bash
ng serve
```

### Build
```bash
ng build
```

## 📋 Development Guidelines

### Adding New Repositories
Follow the naming convention:
```typescript
// ✅ Good
customer-http.repository.ts
order-http.repository.ts
payment-http.repository.ts

// ❌ Avoid
customer.repository.ts
order-web.repository.ts
payment-impl.repository.ts
```

### Adding New Transport Methods
When adding different transport mechanisms:
```typescript
user-grpc.repository.ts      // gRPC communication
user-websocket.repository.ts // WebSocket communication
user-local.repository.ts     // Local storage
```

### Layer Dependencies
- **Domain Layer**: No dependencies on other layers
- **Application Layer**: Depends only on Domain Layer
- **Data Layer**: Depends only on Domain Layer
- **UI Layer**: Can depend on Application and Domain Layers
- **Providers Layer**: Can depend on all layers as needed

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### E2E Tests
```bash
ng e2e
```

## 📚 Architecture Principles Applied

- **Dependency Inversion**: Higher layers don't depend on lower layers
- **Single Responsibility**: Each class/module has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Interface Segregation**: Clients depend only on interfaces they use
- **Dependency Injection**: Dependencies are injected rather than created
- **Clear Naming**: Repository names clearly indicate their transport mechanism

## 🔍 Current Status

✅ **Project Reorganized**: Following DDD principles  
✅ **Repository Consolidation**: All repositories use `-http` naming convention  
✅ **No Duplicates**: Single implementation per domain entity  
✅ **Clean Architecture**: Clear separation of concerns  
✅ **Documentation**: Comprehensive project structure documented  

## 📞 Support

For questions about the architecture or development guidelines, please refer to:
- Angular documentation: https://angular.io/docs
- Domain-Driven Design resources: https://martinfowler.com/bliki/DomainDrivenDesign.html

---

**Last Updated**: December 8, 2025  
**Architecture**: Domain-Driven Design (DDD)  
**Framework**: Angular 17+  
**Repository Pattern**: HTTP-based with clear naming conventions
