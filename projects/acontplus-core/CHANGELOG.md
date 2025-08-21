# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Enhanced error handling with structured error types
- Performance optimizations for large datasets
- Additional utility functions for common operations
- Enhanced TypeScript strict mode compliance
- Additional unit test coverage

## [1.2.1] - 2025-08-21

### 🚀 **New Repository Patterns**

#### **Read-Only Repository Pattern**
- **NEW**: Added `ReadOnlyRepository<T>` abstract class for read-only data access
- **NEW**: Enforces read-only operations while preventing write operations
- **NEW**: Must implement `getAll()`, `getById()`, and `search()` methods
- **NEW**: Write operations (`create`, `update`, `delete`) throw errors when called
- **NEW**: Perfect for reference data, lookup tables, and read-only APIs

#### **Write-Only Repository Pattern**
- **NEW**: Added `WriteOnlyRepository<T>` abstract class for write-only data access
- **NEW**: Enforces write operations while preventing read operations
- **NEW**: Must implement `create()`, `update()`, and `delete()` methods
- **NEW**: Read operations (`getAll`, `getById`, `search`) throw errors when called
- **NEW**: Ideal for audit logs, event streams, and write-only APIs

#### **Repository Factory Service**
- **NEW**: Added `RepositoryFactoryService` for dynamic repository creation
- **NEW**: `createReadOnlyRepository()` method for instant read-only repositories
- **NEW**: `createWriteOnlyRepository()` method for instant write-only repositories
- **NEW**: `createCustomRepository()` method for specialized repository patterns
- **NEW**: Centralized repository management and caching

### 🔧 **Enhanced Use Case Architecture**

#### **Composite Use Case Improvements**
- **NEW**: Enhanced `CompositeUseCase` with action-based routing
- **NEW**: Support for complex business operations with multiple actions
- **NEW**: Better separation of concerns for complex workflows
- **NEW**: Improved error handling and validation flow

#### **Command and Query Pattern**
- **NEW**: Added specialized command and query classes for CQRS pattern
- **NEW**: `CachedUsersQuery` for optimized data retrieval with caching
- **NEW**: `ConditionalUserUpdateCommand` for conditional update operations
- **NEW**: Better separation of read and write operations

### 📚 **Enhanced Documentation and Examples**

#### **Test Application Updates**
- **NEW**: Comprehensive application management use case with 20+ operations
- **NEW**: User management use case with advanced filtering and bulk operations
- **NEW**: Product management use case with pricing and inventory features
- **NEW**: Real-world examples of all repository patterns
- **NEW**: Complete UI components demonstrating the new architecture

#### **Repository Pattern Examples**
- **NEW**: `ReadOnlyUserRepository` demonstrating read-only pattern
- **NEW**: `WriteOnlyUserRepository` demonstrating write-only pattern
- **NEW**: `ApplicationRepository` demonstrating flexible base repository
- **NEW**: Mock services with realistic data for testing

### 🎯 **Use Case Examples**

#### **Application Management**
- **NEW**: Create, update, delete applications with full CRUD operations
- **NEW**: Bulk operations for multiple applications
- **NEW**: Advanced filtering by status, environment, category, and owner
- **NEW**: Deployment management and version control
- **NEW**: Dependency and tag management
- **NEW**: Statistics and reporting capabilities

#### **User Management**
- **NEW**: User CRUD operations with role-based access control
- **NEW**: Bulk user operations (activate, deactivate, delete)
- **NEW**: Advanced search and filtering capabilities
- **NEW**: User statistics and analytics
- **NEW**: Caching strategies for performance optimization

#### **Product Management**
- **NEW**: Product catalog management with categories and pricing
- **NEW**: Inventory tracking and stock management
- **NEW**: Bulk product operations
- **NEW**: Advanced filtering by price range and availability
- **NEW**: Product image and description management

### 🔄 **Migration and Usage**

#### **Repository Pattern Usage**
```typescript
// Read-only repository
@Injectable()
export class ReadOnlyUserRepository extends ReadOnlyRepository<User> {
  protected entityName = 'users';
  protected baseUrl = '/api/users';
  
  // Must implement these methods
  override getAll(pagination: PaginationParams, filters?: FilterParams): Observable<PaginatedResult<User>>
  override getById(id: number): Observable<User>
  override search(query: string, pagination: PaginationParams): Observable<PaginatedResult<User>>
}

// Write-only repository
@Injectable()
export class WriteOnlyUserRepository extends WriteOnlyRepository<User> {
  protected entityName = 'users';
  protected baseUrl = '/api/users';
  
  // Must implement these methods
  override create(entity: Omit<User, 'id'>): Observable<User>
  override update(id: number, entity: Partial<User>): Observable<User>
  override delete(id: number): Observable<boolean>
}
```

#### **Repository Factory Usage**
```typescript
@Injectable()
export class UserService {
  constructor(private repositoryFactory: RepositoryFactoryService) {}
  
  getReadOnlyRepo() {
    return this.repositoryFactory.createReadOnlyRepository<User>('users', '/api/users');
  }
  
  getWriteOnlyRepo() {
    return this.repositoryFactory.createWriteOnlyRepository<User>('users', '/api/users');
  }
}
```

### ⚠️ **Breaking Changes**

- None in this release - all new features are additive

### 🔧 **Technical Improvements**

- Enhanced TypeScript generics for better type safety
- Improved error handling with specific error types
- Better separation of concerns in repository patterns
- Enhanced testability with mock services
- Improved performance with caching strategies

## [1.1.0] - 2025-08-12

### 🚀 **Major Architecture Improvements**

#### **Repository Pattern Enhancement**

- **BREAKING CHANGE**: Updated `BaseRepository` to use modern Angular dependency injection
- **BREAKING CHANGE**: Replaced constructor parameters with `inject()` function and abstract properties
- Added `entityName` and `baseUrl` abstract properties for better URL building
- Enhanced URL building with `buildEntityUrl()` method for entity-specific endpoints
- Improved type safety and testability with proper DI patterns

#### **Use Case Pattern Enhancement**

- **BREAKING CHANGE**: Changed execution pattern from `execute()` to `executeInternal()`
- **BREAKING CHANGE**: Validation is now the default execution path
- Improved separation of concerns with internal execution method
- Better error handling and validation flow
- Enhanced authorization and validation hooks

#### **New Services Added**

- **CoreConfigService**: Centralized configuration management with runtime updates
- **RepositoryFactory**: Centralized repository management and registration system
- Enhanced error handling with domain-specific error types and categorization
- Better configuration management across multiple applications

#### **Enhanced Error Handling**

- Added `ErrorCategory` enum for structured error classification
- New error types: `BusinessRuleError`, `ValidationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`
- Enhanced error properties: `recoverable`, `retryable`, `userActionable`
- Better error categorization for improved debugging and user experience

#### **Configuration Management**

- Dynamic configuration updates at runtime
- Environment-specific configuration overrides
- Feature flags and custom headers support
- Centralized configuration for multi-application support

#### **Repository Factory Pattern**

- Centralized repository registration and management
- Dynamic repository creation and lookup
- Entity-based repository discovery
- Better scalability for multiple applications

### 🔧 **Technical Improvements**

- Modern Angular dependency injection patterns
- Improved TypeScript generics and type safety
- Better separation of concerns in architecture
- Enhanced testability with proper DI patterns
- Improved error handling and validation flow

### 📚 **Documentation**

- Comprehensive README with complete usage examples
- Advanced patterns and best practices documentation
- Testing strategies and examples
- Troubleshooting guide for common issues
- Migration guide for existing implementations
- Performance optimization techniques

### 🧪 **Testing & Examples**

- Moved examples to test-app for better organization
- Comprehensive testing patterns for repositories and use cases
- Example implementations for all major features
- Testing strategies for the new architecture

### ⚠️ **Breaking Changes**

- **BaseRepository**: Constructor parameters removed, use `inject(HttpClient)` instead
- **BaseRepository**: Must implement `entityName` and `baseUrl` abstract properties
- **BaseUseCase**: `execute()` method now calls `executeInternal()`, override `executeInternal()` instead
- **Use Cases**: Validation is now automatic, no need to call `executeWithValidation()` manually

### 🔄 **Migration Guide**

- Add `@Injectable()` decorator to repositories
- Replace constructor parameters with `inject()` function
- Add `entityName` and `baseUrl` abstract properties
- Rename `execute()` method to `executeInternal()` in use cases
- Use `provideCoreConfig()` for configuration setup
- Register repositories using the factory pattern

## [1.0.5] - 2025-08-XX

### Added

- Initial release of acontplus-core library
- JWT token management service with automatic validation
- HTTP interceptors for API response handling and standardization
- Repository pattern implementation for clean data access
- Use case architecture support for business logic encapsulation
- Correlation ID service for request tracing
- Tenant management service for multi-tenancy support
- Toast notification service integration
- Comprehensive API response models and type guards
- Base entity and pagination models
- Filter parameters and search functionality
- Color utility functions
- Environment configuration management
- Response handler service for standardized error handling

### Changed

- Updated to Angular 20+ compatibility
- Functional interceptor pattern using HttpInterceptorFn
- Enhanced TypeScript configuration with ES2022 and bundler module resolution
- Improved error handling with structured error types
- Enhanced logging service with production/development modes
- Signal-based correlation ID management for reactive updates

### Technical Improvements

- Angular 20+ dependency injection patterns
- Strict TypeScript configuration with noImplicitOverride
- Bundler module resolution for build tools
- ES2022 target for JavaScript features
- Comprehensive type definitions and interfaces
- Proper peer dependency management for Angular packages

## [1.0.0] - 2025-07-XX

### Initial Release

- Core library foundation
- Basic service architecture
- HTTP interceptor framework
- Model definitions
- Repository pattern implementation
