# Acontplus Libraries Documentation

Welcome to the comprehensive documentation for the Acontplus Libraries project.
This documentation covers both the UI components library and the core utilities
library.

## 📚 Documentation Overview

### 🎨 UI Components Library (`acontplus-ui-components`)

The UI components library provides a comprehensive set of Angular Material-based
components with consistent styling and behavior.

- **[Component API Reference](component-api.md)** - Complete API documentation
  for all UI components
- **[Component Usage Examples](component-examples.md)** - Practical examples and
  code snippets
- **[Style Guide](style-guide.md)** - Design principles, color system, and
  component guidelines

### 🔧 Core Library (`acontplus-core`)

The core library provides essential utilities, services, and architectural
patterns for Angular applications.

- **[API Response Handling](api-response-handling.md)** - Standardized API
  response handling with interceptors
- **[Core Services](core-services.md)** - Comprehensive documentation for all
  core services

### 🛠️ Development

- **[Linting and Formatting Setup](linting-and-formatting-setup.md)** - Code
  quality tools and configuration

## 🚀 Quick Start

### Installing the Libraries

```bash
# Install UI components library
npm install @acontplus/ui-components

# Install core library
npm install @acontplus/core
```

### Basic Usage

```typescript
// Import UI components
import {
  MatDynamicCardComponent,
  ReusableAutocompleteComponent,
} from '@acontplus/ui-components';

// Import core utilities
import {
  ApiResponse,
  CoreConfigService,
  RepositoryFactory,
} from '@acontplus/core';
```

## 📖 Documentation Structure

```
docs/
├── README.md                           # This file - Documentation overview
├── component-api.md                    # Complete API reference for UI components
├── component-examples.md               # Usage examples and code snippets
├── style-guide.md                     # Design system and component guidelines
├── api-response-handling.md            # Core library API handling documentation
├── core-services.md                    # Core library services documentation
├── linting-and-formatting-setup.md    # Development setup and code quality
└── assets/                            # Documentation assets and images
```

## 🔍 Finding What You Need

- **New to the libraries?** Start with the
  [Component Examples](component-examples.md) to see components in action
- **Looking for specific API details?** Check the
  [Component API Reference](component-api.md)
- **Need to understand the design system?** Review the
  [Style Guide](style-guide.md)
- **Working with API responses?** See
  [API Response Handling](api-response-handling.md)
- **Need core services documentation?** Check [Core Services](core-services.md)
- **Setting up development environment?** Follow
  [Linting and Formatting Setup](linting-and-formatting-setup.md)

## 🆕 What's New

### Latest Updates (2025-08-12)

- **Added AutocompleteWrapperComponent documentation** - Complete examples and
  API reference
- **Added Core Services documentation** - Comprehensive coverage of all core
  library services
- **Updated Component API** - Added missing component documentation
- **Improved examples** - More realistic and practical usage scenarios

### Recently Added Components

- **AutocompleteWrapperComponent** - Advanced autocomplete with local/remote
  search, filtering, and customization
- **Enhanced Dialog Wrapper** - Improved configuration options and responsive
  behavior
- **Advanced Table Components** - Dynamic tables with pagination and filtering

### Recently Added Services

- **CoreConfigService** - Centralized configuration management
- **RepositoryFactory** - Dynamic repository registration and management
- **ResponseHandlerService** - API response processing utilities
- **CorrelationService** - Request tracing and debugging
- **TenantService** - Multi-tenancy support
- **LoggingService** - Structured logging capabilities

## 🤝 Contributing

When contributing to the documentation:

1. Keep examples simple and focused
2. Include code snippets for all features
3. Update related documentation when making changes
4. Follow the established documentation style
5. Test all code examples before submitting

## 📝 Documentation Standards

- Use clear, concise language
- Include practical examples
- Maintain consistent formatting
- Keep information up-to-date with code changes
- Use proper markdown formatting and structure
- Include TypeScript interfaces and types
- Provide real-world usage scenarios

## 🔗 Related Resources

- **Main Project**:
  [GitHub Repository](https://github.com/Acontplus-S-A-S/acontplus-libs)
- **Issues & Bug Reports**:
  [GitHub Issues](https://github.com/Acontplus-S-A-S/acontplus-libs/issues)
- **Contributing Guidelines**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **License**: [MIT License](../LICENSE)

---

For questions or suggestions about this documentation, please refer to the main
project README or create an issue in the project repository.
