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
