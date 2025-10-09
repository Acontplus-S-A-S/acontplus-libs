# Changelog

All notable changes to the acontplus-libs project will be documented in this
file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Comprehensive Library Documentation** - Updated README files for all
  libraries to accurately reflect current codebase
- **New Libraries**: ng-auth, ng-config, ng-customer, ng-infrastructure,
  ng-notifications, ui-kit, utils
- **Nx Migration** - Migrated from npm workspaces to Nx monorepo for better
  build caching and dependency management
- **Clean Architecture Implementation** - Applied clean architecture patterns
  across multiple libraries
- **Authentication Module** - Complete JWT authentication with guards,
  interceptors, and URL redirection
- **Customer Management** - Full customer CRUD operations with clean
  architecture
- **Infrastructure Services** - HTTP interceptors, repositories, and core
  services
- **Notification System** - Toast notifications, alerts, and snackbars using
  ngx-toastr and SweetAlert2

### Changed

- **Library Structure** - Reorganized and renamed libraries to follow Nx
  conventions
- **Documentation Updates** - Aligned all README files with actual library
  implementations
- **Build System** - Migrated to Nx for improved performance and scalability

### Removed

- **Outdated Components** - Removed references to non-existent components from
  previous versions
- **Legacy Documentation** - Updated documentation to match current library
  structure

## [1.1.0] - 2025-08-12

### Added

- **Enhanced Component Library** - Updated ng-components with comprehensive UI
  components
- **Configuration Management** - New ng-config library for environment and app
  configuration
- **Infrastructure Patterns** - ng-infrastructure library with interceptors and
  repositories

### Changed

- **Component Organization** - Better structured components in ng-components
  library
- **Service Architecture** - Improved service patterns across libraries

## [1.0.0] - 2025-06-18

### Added

- Initial Nx monorepo setup
- Core library with pricing calculations and utilities
- Angular components library with Material Design components
- Demo application for showcasing library usage
- Basic testing infrastructure with Jest

### Libraries

- **core**: Pricing calculations, constants, environment configuration
- **ng-components**: UI components including cards, tables, dialogs, theme
  toggle
- **utils**: Utility functions for converters, formatters, and helpers

## Types of changes

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.
