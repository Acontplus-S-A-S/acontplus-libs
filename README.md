# Acontplus Libraries

A comprehensive Nx monorepo containing Angular libraries providing Domain-Driven
Design (DDD) architecture, core utilities, and Angular Material UI components
for enterprise applications.

## 📚 Libraries

- **[core](packages/core/README.md)**: Core library with pricing calculations,
  constants, environment configuration, domain models, and clean architecture
  patterns
- **[ng-auth](packages/ng-auth/README.md)**: Angular authentication module with
  JWT token management, route guards, URL redirection, and session handling
- **[ng-components](packages/ng-components/README.md)**: Angular Material UI
  components including cards, tables, dialogs, theme toggle, and styling
  utilities
- **[ng-config](packages/ng-config/README.md)**: Angular configuration library
  with environment tokens and app configuration services
- **[ng-customer](packages/ng-customer/README.md)**: Customer management
  components and services following clean architecture
- **[ng-infrastructure](packages/ng-infrastructure/README.md)**: Angular
  infrastructure with HTTP interceptors, repositories, adapters, and core
  services
- **[ng-notifications](packages/ng-notifications/README.md)**: Notification
  system with toast notifications, alerts, and snackbars using ngx-toastr and
  SweetAlert2
- **[ui-kit](packages/ui-kit/README.md)**: UI kit library for reusable
  components (under development)
- **[utils](packages/utils/README.md)**: Shared utility functions for
  converters, formatters, helpers, and validators

## 📱 Applications

- **[demo-app](apps/demo-app/)**: Demo application showcasing DDD architecture
  patterns and library usage
- **[demo-app-e2e](apps/demo-app-e2e/)**: End-to-end tests for the demo
  application

## 📖 Documentation

- **[API Response Handling](docs/api-response-handling.md)** - DDD patterns for
  standardized API response handling
- **[Frontend Architecture Guide](docs/frontend-architecture-guide.md)** -
  Architecture patterns and guidelines
- **[Style Guide](docs/style-guide.md)** - Design principles and component
  guidelines
- **[Development Setup](docs/linting-and-formatting-setup.md)** - Code quality
  tools and configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Acontplus-S-A-S/acontplus-libs.git
cd acontplus-libs

# Install dependencies
npm install

# Start demo app
npm start
```

## 🏗️ **Enterprise Features**

- **Clean Architecture**: Proper separation of concerns with distinct layers
- **CQRS Pattern**: Command Query Responsibility Segregation implementation
- **BaseRepository Pattern**: Generic, extensible data access layer with factory
  pattern
- **Use Case Pattern**: Business logic components with validation and
  authorization
- **Response Standardization**: Unified API response handling with interceptors
- **Nx Monorepo**: Efficient build system with caching and dependency management
- **Multi-Application Support**: Designed for sharing across multiple Angular
  apps
- **Modern Angular Practices**: Latest Angular patterns and best practices

## 🎯 **Key Benefits**

- **Consistent Architecture**: Same patterns across all applications
- **Easy Configuration**: Environment-specific settings and runtime updates
- **Scalable BaseRepository Management**: Centralized registration and dynamic
  creation
- **Better Testing**: Dependency injection for mocking and isolated components
- **Developer Experience**: Clear patterns, consistent API design, better error
  messages
- **Fast Builds**: Nx caching and parallelization for efficient development
- **Code Sharing**: Seamless sharing of libraries across applications

## 🛠️ Development

### Available Scripts

- `npm start` - Start the demo application with SSL
- `npm run build` - Build the demo application
- `npm run watch` - Build demo app in watch mode
- `npm run test` - Run tests for all projects
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run build:all` - Build all projects
- `npm run build:libs` - Build all library packages
- `npm run lint` - Lint all projects
- `npm run lint:fix` - Lint and auto-fix issues
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check code formatting
- `npm run clean` - Reset Nx cache
- `npm run local-registry` - Start local npm registry for development
- `npm run e2e` - Run end-to-end tests

### Nx Commands

```bash
# Build specific project
npx nx build core
npx nx build ng-components

# Test specific project
npx nx test core
npx nx test ng-components

# Lint specific project
npx nx lint core

# Show project graph
npx nx show projects

# Show dependency graph
npx nx graph
```

## 🔧 Nx Development Guide

### Monorepo Structure

This workspace is an Nx monorepo containing Angular libraries and applications:

- **Libraries**: `core`, `ng-auth`, `ng-components`, `ng-config`, `ng-customer`,
  `ng-infrastructure`, `ng-notifications`, `ui-kit`, `utils`
- **Applications**: `demo-app`, `demo-app-e2e`

### Project Dependencies

Always build dependencies before dependents:

1. `core` - Base utilities, no dependencies
2. `utils` - Shared utilities, may depend on core
3. `ng-config` - Configuration services, depends on core
4. `ng-infrastructure` - Infrastructure services, depends on ng-config and core
5. `ng-auth` - Authentication module, depends on ng-infrastructure, ng-config,
   and core
6. `ng-components` - UI components, depends on core
7. `ng-customer` - Customer management, depends on ng-components, ng-auth,
   ng-notifications, and core
8. `ng-notifications` - Notification components, no dependencies
9. `ui-kit` - Additional UI components (under development)
10. `demo-app` - Demo application, depends on all libraries

### Development Best Practices

#### 1. Use Nx Commands

Always use `npx nx` commands instead of direct tool execution for consistency
and caching.

#### 2. Leverage Affected Commands

Use `npx nx affected:*` commands to only run operations on projects affected by
your changes:

```bash
npx nx affected:build
npx nx affected:test
npx nx affected:lint
```

#### 3. Cache Management

Nx automatically caches build and test results. Clear cache when needed:

```bash
npm run clean  # Resets Nx cache
```

#### 4. Local Registry for Development

For testing library changes in applications:

```bash
# Start local npm registry
npm run local-registry

# Build and publish libraries locally
npx nx release --local

# Use local versions in applications
```

#### 5. Code Generation

Use Nx generators for consistent project structure:

```bash
# Generate new library
npx nx g @nx/angular:library my-lib

# Generate component in specific library
npx nx g @nx/angular:component my-component --project=ng-components
```

### Nx Configuration

#### nx.json

- **targetDefaults**: Shared configuration for build, test, lint targets
- **namedInputs**: Defines what files trigger rebuilds
- **generators**: Custom generator configurations
- **release**: Publishing configuration

#### Key Benefits

1. **Fast Builds**: Nx caching reduces build times significantly
2. **Affected Commands**: Only run operations on changed projects
3. **Dependency Graph**: Visual understanding of project relationships
4. **Code Generation**: Consistent project structure with generators
5. **Scalability**: Efficient handling of large monorepos
6. **Developer Experience**: Rich tooling and automation

### Troubleshooting

#### Build Issues

- Ensure dependencies are built first
- Check `npx nx graph` for dependency relationships
- Use `npx nx reset` to clear cache

#### Test Issues

- Run tests individually: `npx nx test <project>`
- Check test configuration in `project.json`
- Ensure proper imports in test setup

#### Import Issues

- Use path mappings defined in `tsconfig.base.json`
- Libraries are available as `@acontplus/<lib-name>`
- Check package.json exports in each library

### Migration from npm Workspaces

This workspace was migrated from npm workspaces to Nx monorepo:

- **Before**: Manual dependency management with npm workspaces
- **After**: Automated dependency management with Nx
- **Benefits**: Better caching, affected commands, visual tools
- **Commands**: Updated to use `npx nx` instead of npm scripts

### Code Quality Tools

#### ESLint Configuration

- **Global Rules**: Applied to all TypeScript and HTML files
- **Angular Specific**: Enforces Angular best practices and naming conventions
- **TypeScript Rules**: Type safety and code quality rules
- **Formatting Rules**: Consistent code style across the project
- **Accessibility Rules**: HTML template accessibility checks

#### Prettier Configuration

- **Consistent Formatting**: 2-space indentation, single quotes, trailing commas
- **File-specific Rules**: Different settings for JSON, Markdown, and YAML files
- **Project-level Configs**: Each project can have its own Prettier settings

#### EditorConfig

- **Cross-editor Consistency**: Ensures consistent coding style regardless of
  editor
- **File-type Specific**: Different rules for TypeScript, HTML, CSS, JSON, etc.
- **Line Ending Management**: Consistent line endings across platforms

### Code Style Guidelines

#### Component Selectors

- **core, ng-components, ng-customer, ng-notifications**: `acp` prefix
- **demo-app**: `app` prefix

#### Naming Conventions

- **Components**: kebab-case (e.g., `dynamic-card`)
- **Directives**: camelCase (e.g., `toUpperCase`)
- **Services**: camelCase (e.g., `correlationService`)
- **Models**: camelCase (e.g., `apiResponseModel`)

#### Import Organization

- Angular imports first
- Third-party libraries
- Internal library imports
- Relative imports last

## 📁 Project Structure

```
acontplus-libs/
├── apps/
│   ├── demo-app/               # Demo application
│   │   ├── src/
│   │   │   ├── app/            # Application code
│   │   │   ├── assets/         # Static assets
│   │   │   ├── environments/   # Environment configurations
│   │   │   └── index.html
│   │   ├── project.json        # Nx project configuration
│   │   └── tsconfig.json
│   └── demo-app-e2e/           # E2E tests
│       ├── src/
│       └── project.json
├── packages/
│   ├── core/                   # Core utilities library
│   │   ├── src/lib/
│   │   │   ├── environments/   # Environment configuration
│   │   │   ├── interceptors/   # HTTP interceptors
│   │   │   ├── models/         # Data models and interfaces
│   │   │   ├── repositories/   # BaseRepository pattern implementation
│   │   │   ├── services/       # Core services
│   │   │   ├── use-cases/      # Use case pattern implementation
│   │   │   └── utils/          # Utility functions
│   │   ├── project.json        # Nx project configuration
│   │   └── README.md           # Core library documentation
│   ├── ng-components/          # UI components library
│   │   ├── src/lib/
│   │   │   ├── components/     # UI components
│   │   │   ├── services/       # UI-related services
│   │   │   ├── models/         # UI component models
│   │   │   └── styles/         # Component styles and themes
│   │   ├── project.json
│   │   └── README.md           # UI components documentation
│   ├── ng-config/                # Core Angular services
│   ├── ng-auth/                 # Authentication services
│   ├── ng-infrastructure/       # Infrastructure services
│   ├── ng-customer/            # Customer management
│   ├── ng-notifications/       # Notifications system
│   ├── ui-kit/                 # Additional UI components
│   └── utils/                  # Shared utilities
├── docs/                       # Comprehensive documentation
│   ├── api-response-handling.md
│   ├── frontend-architecture-guide.md
│   ├── linting-and-formatting-setup.md
│   └── style-guide.md
├── nx.json                     # Nx workspace configuration
├── package.json                # Root dependencies and scripts
├── tsconfig.base.json          # Base TypeScript configuration
└── jest.config.js              # Jest testing configuration
```

## 🔧 Configuration Files

### Nx (nx.json)

- **Target Defaults**: Shared configuration for build, test, and lint targets
- **Named Inputs**: Defines what files affect different operations
- **Cache Settings**: Optimizes build performance
- **Release Configuration**: Automated publishing setup

### Jest (jest.config.js)

- Angular testing with jest-preset-angular
- JSDOM environment for component testing
- Module name mapping for library imports
- Coverage reporting configuration
- TypeScript support via ts-jest

### ESLint (eslint.config.js)

- Enforces Angular best practices
- TypeScript-specific rules
- Template accessibility checks
- Consistent code formatting

### Prettier (.prettierrc)

- 2-space indentation
- Single quotes preferred
- 100 character line length
- Trailing commas on multiline

### EditorConfig (.editorconfig)

- UTF-8 encoding
- LF line endings
- 2-space indentation
- File-type specific rules

## 🧪 Testing

This project uses **Jest** as the test runner for fast, reliable testing with
excellent Angular support.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (automatically re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for specific project
npx nx test core
npx nx test ng-components
```

### Jest Configuration

- **Configuration**: `jest.config.js` - Main Jest configuration
- **Setup**: `setup-jest.ts` - Jest setup and mocks
- **TypeScript**: `tsconfig.spec.json` - TypeScript configuration for tests
- **Environment**: Uses `jsdom` environment for Angular component testing
- **Module Resolution**: Configured to resolve library imports

### Test File Patterns

Jest automatically discovers test files matching these patterns:

- `**/__tests__/**/*.ts`
- `**/?(*.)+(spec|test).ts`

### Coverage Reports

Coverage reports are generated in the `coverage/` directory with:

- **Text summary** in terminal
- **HTML report** for detailed coverage analysis
- **LCOV format** for CI/CD integration

## 📦 Building and Publishing

```bash
# Build all libraries
npm run build:libs

# Build specific library
npx nx build core
npx nx build ng-components

# Build demo app
npm run build

# Start local registry for development
npm run local-registry

# Publish libraries (handled by Nx release)
npx nx release
```

## 📚 **Documentation**

Comprehensive documentation is available across the project:

- **[API Response Handling](docs/api-response-handling.md)** - DDD patterns for
  API handling
- **[Frontend Architecture Guide](docs/frontend-architecture-guide.md)** -
  Architecture patterns and guidelines
- **[Style Guide](docs/style-guide.md)** - Design system guidelines
- **[Development Setup](docs/linting-and-formatting-setup.md)** - Code quality
  tools
- **[Core Library Guide](packages/core/README.md)** - Complete core library
  documentation
- **[UI Components Guide](packages/ng-components/README.md)** - Complete UI
  components documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting: `npm run lint:all`
5. Fix any issues: `npm run lint:fix` and `npm run format`
6. Run tests: `npm run test`
7. Submit a pull request

### Development Workflow

```bash
# 1. Make code changes
# 2. Check formatting
npm run format:check

# 3. Format code if needed
npm run format

# 4. Check linting
npm run lint

# 5. Fix auto-fixable issues
npm run lint:fix

# 6. Run tests
npm run test

# 7. Build affected projects
npx nx affected:build

# 8. Run affected tests
npx nx affected:test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🆘 Support

- **Issues**:
  [GitHub Issues](https://github.com/Acontplus-S-A-S/acontplus-libs/issues)
- **Documentation**: See links in the Documentation section above
- **Contact**: [Ivan Paz](https://github.com/iferpaz7)

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and
improvements.

## 🏆 **Architecture Assessment**

**Current Status**: Enterprise-grade Nx monorepo solution

The library now represents a **state-of-the-art, enterprise-ready foundation**
that follows modern Angular development patterns with Nx monorepo management.
It's perfectly suited for multiple Angular applications and provides an
excellent base for building scalable, maintainable applications with efficient
build caching and code sharing.

**This is exactly the kind of foundation you want for a multi-application
Angular ecosystem.** 🚀

- **Multi-Application Support**: Designed for sharing across multiple Angular
  apps
- **Modern Angular Practices**: Latest Angular patterns and best practices

## 🎯 **Key Benefits**

- **Consistent Architecture**: Same patterns across all applications
- **Easy Configuration**: Environment-specific settings and runtime updates
- **Scalable BaseRepository Management**: Centralized registration and dynamic
  creation
- **Better Testing**: Dependency injection for mocking and isolated components
- **Developer Experience**: Clear patterns, consistent API design, better error
  messages

## 🛠️ Development

### Available Scripts

#### Root Level

- `npm run build` - Build all projects
- `npm run build-library` - Build core and UI component libraries
- `npm run test` - Run Jest tests for all projects
- `npm run test:watch` - Run Jest tests in watch mode
- `npm run test:coverage` - Run Jest tests with coverage report
- `npm run lint` - Lint all projects
- `npm run lint:fix` - Lint and auto-fix issues
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check code formatting
- `npm run format:fix` - Format code (alias for format)
- `npm run lint:all` - Run both linting and format checking

#### Individual Projects

Each project has its own format scripts:

- `npm run format` - Format project code
- `npm run format:check` - Check project formatting
- `npm run format:fix` - Format project code (alias)

### Code Quality Tools

#### ESLint Configuration

- **Global Rules**: Applied to all TypeScript and HTML files
- **Angular Specific**: Enforces Angular best practices and naming conventions
- **TypeScript Rules**: Type safety and code quality rules
- **Formatting Rules**: Consistent code style across the project
- **Accessibility Rules**: HTML template accessibility checks

#### Prettier Configuration

- **Consistent Formatting**: 2-space indentation, single quotes, trailing commas
- **File-specific Rules**: Different settings for JSON, Markdown, and YAML files
- **Project-level Configs**: Each project can have its own Prettier settings

#### EditorConfig

- **Cross-editor Consistency**: Ensures consistent coding style regardless of
  editor
- **File-type Specific**: Different rules for TypeScript, HTML, CSS, JSON, etc.
- **Line Ending Management**: Consistent line endings across platforms

### Code Style Guidelines

#### Component Selectors

- **acontplus-core**: `acp` prefix
- **acontplus-ui-components**: `acp` prefix
- **test-app**: `app` prefix

#### Naming Conventions

- **Components**: kebab-case (e.g., `dynamic-card`)
- **Directives**: camelCase (e.g., `toUpperCase`)
- **Services**: camelCase (e.g., `correlationService`)
- **Models**: camelCase (e.g., `apiResponseModel`)

#### Import Organization

- Angular imports first
- Third-party libraries
- Internal library imports
- Relative imports last

## 📁 Project Structure

```
acontplus-libs/
├── apps/
│   ├── demo-app/               # Demo application
│   │   ├── src/
│   │   │   ├── app/            # Application code
│   │   │   ├── assets/         # Static assets
│   │   │   ├── environments/   # Environment configurations
│   │   │   └── index.html
│   │   ├── project.json        # Nx project configuration
│   │   └── tsconfig.json
│   └── demo-app-e2e/           # E2E tests
│       ├── src/
│       └── project.json
├── packages/
│   ├── core/                   # Core utilities library
│   │   ├── src/lib/
│   │   │   ├── environments/   # Environment configuration
│   │   │   ├── interceptors/   # HTTP interceptors
│   │   │   ├── models/         # Data models and interfaces
│   │   │   ├── repositories/   # BaseRepository pattern implementation
│   │   │   ├── services/       # Core services
│   │   │   ├── use-cases/      # Use case pattern implementation
│   │   │   └── utils/          # Utility functions
│   │   ├── project.json        # Nx project configuration
│   │   └── README.md           # Core library documentation
│   ├── ng-components/          # UI components library
│   │   ├── src/lib/
│   │   │   ├── components/     # UI components
│   │   │   ├── services/       # UI-related services
│   │   │   ├── models/         # UI component models
│   │   │   └── styles/         # Component styles and themes
│   │   ├── project.json
│   │   └── README.md           # UI components documentation
│   ├── ng-config/              # Configuration services
│   ├── ng-auth/                # Authentication services
│   ├── ng-infrastructure/      # Infrastructure services
│   ├── ng-customer/            # Customer management
│   ├── ng-notifications/       # Notifications system
│   ├── ui-kit/                 # Additional UI components
│   └── utils/                  # Shared utilities
├── docs/                       # Comprehensive documentation
│   ├── api-response-handling.md
│   ├── frontend-architecture-guide.md
│   ├── linting-and-formatting-setup.md
│   └── style-guide.md
├── nx.json                     # Nx workspace configuration
├── package.json                # Root dependencies and scripts
├── tsconfig.base.json          # Base TypeScript configuration
└── jest.config.js              # Jest testing configuration
```

## 🔧 Configuration Files

### Nx (nx.json)

- **Target Defaults**: Shared configuration for build, test, and lint targets
- **Named Inputs**: Defines what files affect different operations
- **Cache Settings**: Optimizes build performance
- **Release Configuration**: Automated publishing setup

### Jest (jest.config.js)

- Angular testing with jest-preset-angular
- JSDOM environment for component testing
- Module name mapping for library imports
- Coverage reporting configuration
- TypeScript support via ts-jest

### ESLint (eslint.config.js)

- Enforces Angular best practices
- TypeScript-specific rules
- Template accessibility checks
- Consistent code formatting

### Prettier (.prettierrc)

- 2-space indentation
- Single quotes preferred
- 100 character line length
- Trailing commas on multiline

### EditorConfig (.editorconfig)

- UTF-8 encoding
- LF line endings
- 2-space indentation
- File-type specific rules

## 🧪 Testing

This project uses **Jest** as the test runner for fast, reliable testing with
excellent Angular support.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (automatically re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for specific project
npx nx test core
npx nx test ng-components
```

### Jest Configuration

- **Configuration**: `jest.config.js` - Main Jest configuration
- **Setup**: `setup-jest.ts` - Jest setup and mocks
- **TypeScript**: `tsconfig.spec.json` - TypeScript configuration for tests
- **Environment**: Uses `jsdom` environment for Angular component testing
- **Module Resolution**: Configured to resolve library imports

### Test File Patterns

Jest automatically discovers test files matching these patterns:

- `**/__tests__/**/*.ts`
- `**/?(*.)+(spec|test).ts`

### Coverage Reports

Coverage reports are generated in the `coverage/` directory with:

- **Text summary** in terminal
- **HTML report** for detailed coverage analysis
- **LCOV format** for CI/CD integration

## 📦 Building and Publishing

```bash
# Build all libraries
npm run build:libs

# Build specific library
npx nx build core
npx nx build ng-components

# Build demo app
npm run build

# Start local registry for development
npm run local-registry

# Publish libraries (handled by Nx release)
npx nx release
```

## 📚 **Documentation**

Comprehensive documentation is available across the project:

- **[API Response Handling](docs/api-response-handling.md)** - DDD patterns for
  API handling
- **[Frontend Architecture Guide](docs/frontend-architecture-guide.md)** -
  Architecture patterns and guidelines
- **[Style Guide](docs/style-guide.md)** - Design system guidelines
- **[Development Setup](docs/linting-and-formatting-setup.md)** - Code quality
  tools
- **[Core Library Guide](packages/core/README.md)** - Complete core library
  documentation
- **[UI Components Guide](packages/ng-components/README.md)** - Complete UI
  components documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting: `npm run lint:all`
5. Fix any issues: `npm run lint:fix` and `npm run format`
6. Run tests: `npm run test`
7. Submit a pull request

### Development Workflow

```bash
# 1. Make code changes
# 2. Check formatting
npm run format:check

# 3. Format code if needed
npm run format

# 4. Check linting
npm run lint

# 5. Fix auto-fixable issues
npm run lint:fix

# 6. Run tests
npm run test

# 7. Build affected projects
npx nx affected:build

# 8. Run affected tests
npx nx affected:test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🆘 Support

- **Issues**:
  [GitHub Issues](https://github.com/Acontplus-S-A-S/acontplus-libs/issues)
- **Documentation**: See links in the Documentation section above
- **Contact**: [Ivan Paz](https://github.com/iferpaz7)

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and
improvements.

## 🏆 **Architecture Assessment**

**Current Status**: Enterprise-grade Nx monorepo solution

The library now represents a **state-of-the-art, enterprise-ready foundation**
that follows modern Angular development patterns with Nx monorepo management.
It's perfectly suited for multiple Angular applications and provides an
excellent base for building scalable, maintainable applications with efficient
build caching and code sharing.

**This is exactly the kind of foundation you want for a multi-application
Angular ecosystem.** 🚀
