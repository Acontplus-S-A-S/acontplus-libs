# Development Guidelines for acontplus-libs

This document provides guidelines and instructions for developing and maintaining the acontplus-libs project.

## Project Structure

The project is organized as a monorepo with multiple Angular libraries:

- **acontplus-utils**: A utility library with services, interceptors, models, and utility functions
- **acontplus-ui-components**: A UI component library built with Angular Material
- **test-app**: A test application for demonstrating and testing the libraries

## Build and Configuration Instructions

### Prerequisites

- Node.js (latest LTS version recommended)
- Angular CLI (version 20.x)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Acontplus-S-A-S/acontplus-libs.git
   cd acontplus-libs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Building the Libraries

To build all libraries:

```bash
npm run build-library
```

To build and package the libraries for distribution:

```bash
npm run build-and-pack
```

This will create .tgz files in the dist directory for each library.

### Development Server

To start the development server with SSL:

```bash
npm start
```

The application will be available at https://localhost:4200/

## Testing Information

### Running Tests

The project uses Jasmine and Karma for testing. To run tests for all projects:

```bash
npm test
```

To run tests for a specific project:

```bash
ng test acontplus-utils
ng test acontplus-ui-components
ng test test-app
```

To run a specific test file:

```bash
ng test acontplus-utils --include=**/string-utils.spec.ts
```

### Writing Tests

Tests should be placed in .spec.ts files alongside the files they test. For example:

- `string-utils.ts` → `string-utils.spec.ts`
- `jwt-token.service.ts` → `jwt-token.service.spec.ts`

#### Example Test

Here's an example of a test for a utility function:

```typescript
import { capitalizeFirstLetter } from './string-utils';

describe('String Utils', () => {
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
    });

    it('should handle empty strings', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(capitalizeFirstLetter(null as unknown as string)).toBe(null);
      expect(capitalizeFirstLetter(undefined as unknown as string)).toBe(undefined);
    });
  });
});
```

### Test Coverage

Test coverage reports are generated when running tests. You can view the coverage report in the `coverage` directory after running tests with the `--code-coverage` flag:

```bash
ng test acontplus-utils --code-coverage
```

## Code Style and Development Guidelines

### Code Style

- The project uses ESLint for linting. Run `npm run lint` to check for linting issues.
- Follow the Angular style guide for naming conventions and code organization.
- Use TypeScript features like strong typing, interfaces, and access modifiers.
- Document public APIs with JSDoc comments.

### Component Development (acontplus-ui-components)

- Components should be designed to be reusable and configurable.
- Use Angular Material as the foundation for UI components.
- Styles should be written in SCSS.
- Components should be responsive and accessible.

### Utility Development (acontplus-utils)

- Utility functions should be pure functions when possible.
- Services should follow the Angular dependency injection pattern.
- Interceptors should handle specific HTTP concerns.
- Models should define clear interfaces for data structures.

### Git Workflow

- Create feature branches from the main branch.
- Submit pull requests for code review.
- Ensure all tests pass before merging.
- Keep commits focused and use descriptive commit messages.

## Deployment

To publish the libraries to npm:

1. Build and pack the libraries:
   ```bash
   npm run build-and-pack
   ```

2. Publish each library:
   ```bash
   cd dist/acontplus-utils
   npm publish
   
   cd ../acontplus-ui-components
   npm publish
   ```

## Troubleshooting

- If you encounter SSL issues when running the development server, ensure the SSL certificates in the `ssl` directory are valid.
- If tests fail to run, check that the Karma configuration is correct and that all dependencies are installed.
- For build errors, check the Angular version compatibility and ensure all dependencies are up to date.