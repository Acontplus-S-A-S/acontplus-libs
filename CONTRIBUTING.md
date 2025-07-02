# Contributing to acontplus-libs

Thank you for your interest in contributing to acontplus-libs! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Versioning](#versioning)

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors. Please be respectful and considerate of others when participating in this project.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/acontplus-libs.git
   cd acontplus-libs
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up the upstream remote**:
   ```bash
   git remote add upstream https://github.com/Acontplus-S-A-S/acontplus-libs.git
   ```

## Development Workflow

1. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-description
   ```

2. **Make your changes** following the [coding standards](#coding-standards).

3. **Run tests** to ensure your changes don't break existing functionality:
   ```bash
   npm test
   ```

4. **Build the libraries** to verify your changes:
   ```bash
   npm run build-library
   ```

5. **Commit your changes** with a descriptive commit message:
   ```bash
   git commit -m "feat: add new feature" # for features
   git commit -m "fix: resolve issue with component" # for bug fixes
   git commit -m "docs: update documentation" # for documentation changes
   git commit -m "refactor: improve code structure" # for code refactoring
   git commit -m "test: add tests for component" # for adding tests
   ```

6. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a pull request** from your fork to the main repository.

## Pull Request Process

1. **Update the README.md** with details of changes if applicable.
2. **Update the CHANGELOG.md** following the [Keep a Changelog](https://keepachangelog.com/) format.
3. **Ensure all tests pass** and your code follows the project's coding standards.
4. **Add appropriate labels** to your pull request.
5. **Request a review** from one of the project maintainers.
6. **Address any feedback** provided during the review process.
7. **Once approved**, your pull request will be merged by a maintainer.

## Coding Standards

We follow the [Angular Style Guide](https://angular.io/guide/styleguide) for this project. Additionally:

- Use TypeScript features like strong typing, interfaces, and access modifiers.
- Document public APIs with JSDoc comments.
- Follow the project's [style guide](docs/style-guide.md) for component design and usage.
- Use consistent naming conventions:
  - Components: `kebab-case` for selectors, `PascalCase` for class names
  - Services: `PascalCase` for class names
  - Interfaces: `PascalCase` with descriptive names
  - Files: `kebab-case.type.ts` (e.g., `user-profile.component.ts`)

## Testing Guidelines

- Write unit tests for all new functionality.
- Place tests in `.spec.ts` files alongside the files they test.
- Aim for high test coverage, especially for critical functionality.
- Test edge cases and error conditions.
- Follow the testing examples in the existing codebase.

## Documentation Guidelines

- Document all public APIs with JSDoc comments.
- Update the README.md file with any new features or changes.
- Add usage examples for new components or services.
- Update the component API documentation in docs/component-api.md.
- Follow the documentation style in the existing codebase.

## Versioning

We use [Semantic Versioning](https://semver.org/) for this project:

- MAJOR version for incompatible API changes (X.y.z)
- MINOR version for adding functionality in a backward-compatible manner (x.Y.z)
- PATCH version for backward-compatible bug fixes (x.y.Z)

---

Thank you for contributing to acontplus-libs! Your efforts help make this project better for everyone.