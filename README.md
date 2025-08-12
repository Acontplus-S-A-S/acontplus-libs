# Acontplus Libraries

A comprehensive collection of Angular libraries providing core utilities, UI
components, and development tools.

## 📚 Libraries

- **acontplus-core**: Core utilities, services, interceptors, and models for
  Angular applications
- **acontplus-ui-components**: Reusable UI components built with Angular
  Material
- **test-app**: Demo application showcasing the libraries

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Angular CLI 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Acontplus-S-A-S/acontplus-libs.git
cd acontplus-libs

# Install dependencies
npm install

# Build libraries
npm run build-library

# Start demo app
npm start
```

## 🛠️ Development

### Available Scripts

#### Root Level

- `npm run build` - Build all projects
- `npm run build-library` - Build core and UI component libraries
- `npm run test` - Run tests for all projects
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

- **Components**: kebab-case (e.g., `mat-dynamic-card`)
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
├── projects/
│   ├── acontplus-core/          # Core utilities library
│   ├── acontplus-ui-components/ # UI components library
│   └── test-app/               # Demo application
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .editorconfig               # Editor configuration
└── package.json                # Root dependencies and scripts
```

## 🔧 Configuration Files

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

```bash
# Run all tests
npm run test

# Run tests for specific project
ng test acontplus-core
ng test acontplus-ui-components
ng test test-app
```

## 📦 Building

```bash
# Build all libraries
npm run build-library

# Build specific library
ng build acontplus-core
ng build acontplus-ui-components

# Build demo app
ng build test-app
```

## 🚀 Publishing

```bash
# Build and pack libraries
npm run build-and-pack

# Pack individual libraries
npm run pack-acontplus-core
npm run pack-acontplus-ui-components
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting: `npm run lint:all`
5. Fix any issues: `npm run lint:fix` and `npm run format`
6. Submit a pull request

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

# 7. Build to verify
npm run build-library
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🆘 Support

- **Issues**:
  [GitHub Issues](https://github.com/Acontplus-S-A-S/acontplus-libs/issues)
- **Documentation**:
  [Project Wiki](https://github.com/Acontplus-S-A-S/acontplus-libs/wiki)
- **Contact**: [Ivan Paz](https://github.com/ivanpaz)

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and
improvements.
