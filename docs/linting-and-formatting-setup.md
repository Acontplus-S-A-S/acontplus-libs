# Linting and Formatting Setup

This document describes the comprehensive code quality setup implemented for the
Acontplus Libraries project.

## 🎯 Overview

We have implemented a robust code quality system that includes:

- **ESLint**: Code linting with Angular-specific rules
- **Prettier**: Code formatting for consistency
- **EditorConfig**: Cross-editor coding style consistency
- **Automated Scripts**: Easy-to-use npm scripts for development workflow

## 🔧 Configuration Files

### 1. ESLint Configuration (`eslint.config.js`)

**Features:**

- Angular-specific linting rules
- TypeScript code quality enforcement
- Template accessibility checks
- Consistent formatting rules
- Project-specific rule overrides

**Key Rules:**

```javascript
// Angular component selector rules
"@angular-eslint/component-selector": [
  "error",
  {
    type: "element",
    prefix: "acp",
    style: "kebab-case",
  },
],

// TypeScript rules
"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
"@typescript-eslint/no-explicit-any": "warn",

// Formatting rules
"indent": ["error", 2, { "SwitchCase": 1 }],
"quotes": ["error", "single", { "avoidEscape": true }],
"semi": ["error", "always"],
```

### 2. Prettier Configuration (`.prettierrc`)

**Global Settings:**

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

**File-specific Overrides:**

- JSON files: 80 character width
- Markdown files: 80 character width, always wrap
- YAML files: Double quotes

### 3. EditorConfig (`.editorconfig`)

**Cross-platform consistency:**

- UTF-8 encoding
- LF line endings (Unix-style)
- 2-space indentation
- File-type specific rules

### 4. Prettier Ignore (`.prettierignore`)

**Excluded from formatting:**

- `node_modules/`
- `dist/`
- `coverage/`
- `package-lock.json`
- Build outputs
- IDE files

## 📜 Available Scripts

### Root Level Scripts

```bash
# Linting
pnpm run lint              # Lint all projects
pnpm run lint:fix          # Lint and auto-fix issues
pnpm run lint:all          # Lint + format check

# Formatting
pnpm run format            # Format all code
pnpm run format:check      # Check formatting without changes
pnpm run format:fix        # Alias for format
```

### Project-level Scripts

Each project has its own formatting scripts:

```bash
# In any project directory
pnpm run format            # Format project code
pnpm run format:check      # Check project formatting
pnpm run format:fix        # Format project code
```

## 🚀 Development Workflow

### 1. Before Committing Code

```bash
# 1. Check formatting
pnpm run format:check

# 2. Format if needed
pnpm run format

# 3. Check linting
pnpm run lint

# 4. Fix auto-fixable issues
pnpm run lint:fix

# 5. Run tests
pnpm run test
```

### 2. Continuous Integration

The CI pipeline should run:

```bash
pnpm run lint:all          # Lint + format check
pnpm run test              # Run all tests
pnpm run build:all         # Build verification
```

## 📊 Current Status

### ✅ What's Working

- **ESLint**: Successfully configured and running
- **Prettier**: All code properly formatted
- **EditorConfig**: Cross-editor consistency
- **Automated Scripts**: All npm scripts functional
- **Project Structure**: Clean, organized configuration

### ⚠️ Remaining Issues

#### Test Files

- Many `.spec.ts` files have parsing errors due to test framework configuration
- These are typically not critical for production code

#### Component Selectors

- Some components don't follow the `acp` prefix convention
- Need to update component decorators

#### TypeScript Issues

- Some `any` types still present (warnings, not errors)
- Unused variables in some files
- Missing lifecycle interface implementations

### 🔧 Recommended Next Steps

1. **Fix Component Selectors**

   ```typescript
   // Update component decorators to use correct prefixes
   @Component({
     selector: 'acp-component-name',  // Instead of 'app-component-name'
     // ...
   })
   ```

2. **Address TypeScript Issues**
   - Replace `any` types with proper interfaces
   - Implement missing lifecycle interfaces
   - Remove unused imports and variables

3. **Test Configuration**
   - Fix test file parsing issues
   - Ensure test framework is properly configured

4. **Accessibility Improvements**
   - Add keyboard event handlers for click events
   - Associate labels with form controls
   - Ensure interactive elements are focusable

## 📚 Best Practices

### Code Style

1. **Use Single Quotes** for strings
2. **Always Add Semicolons**
3. **2-Space Indentation**
4. **Trailing Commas** on multiline objects/arrays
5. **100 Character Line Limit**

### Angular Conventions

1. **Component Selectors**: Use appropriate prefixes (`acp`, `app`)
2. **Lifecycle Hooks**: Implement proper interfaces
3. **Dependency Injection**: Prefer `inject()` function over constructor
   injection
4. **Template Accessibility**: Follow ARIA guidelines

### TypeScript Best Practices

1. **Avoid `any` Types**: Use proper interfaces
2. **Unused Variables**: Prefix with underscore (`_unused`)
3. **Generic Types**: Use `Record<K, V>` instead of index signatures
4. **Type Inference**: Let TypeScript infer simple types

## 🛠️ Troubleshooting

### Common Issues

1. **ESLint Parsing Errors**
   - Check TypeScript configuration
   - Ensure proper file extensions
   - Verify Angular version compatibility

2. **Prettier Conflicts**
   - Check `.prettierignore` file
   - Verify file extensions are included
   - Run `pnpm run format:check` to identify issues

3. **Editor Integration**
   - Install ESLint and Prettier extensions
   - Configure auto-format on save
   - Set up EditorConfig support

### Getting Help

- Check the [ESLint documentation](https://eslint.org/)
- Review
  [Prettier configuration options](https://prettier.io/docs/en/configuration.html)
- Consult [EditorConfig specifications](https://editorconfig.org/)
- Review Angular style guide for component conventions

## 📈 Metrics and Monitoring

### Code Quality Metrics

- **Lint Errors**: Target 0
- **Lint Warnings**: Target < 50
- **Formatting Issues**: Target 0
- **Test Coverage**: Target > 80%

### Regular Maintenance

- **Weekly**: Run `pnpm run lint:all` to check status
- **Monthly**: Review and update configuration rules
- **Quarterly**: Assess new ESLint/Prettier features
- **Annually**: Major configuration review and updates

---

_Last updated: December 2024_ _Maintained by: Development Team_
