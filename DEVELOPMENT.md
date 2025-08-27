# Development Guide

## Monorepo Structure

This workspace contains two Angular libraries:

- `acontplus-core`: Core utilities, services, and models
- `acontplus-ui-components`: UI components that depend on acontplus-core

## Local Development Setup

### Initial Setup

```bash
# Verify workspace configuration
npm run workspace:verify

# Install all dependencies (includes workspace linking)
npm install

# Verify workspace is properly configured
npm run workspace:check
```

### Development Workflow

```bash
# Clean build directories
npm run workspace:clean

# Build all libraries
npm run workspace:build

# Or build individually
npm run workspace:core    # Build acontplus-core
npm run workspace:ui      # Build acontplus-ui-components

# Development builds with watch mode
npm run build-core -- --watch &
npm run build-ui -- --watch
```

## Build Order

Always build `acontplus-core` before `acontplus-ui-components`:

```bash
# Build all libraries
npm run build-all

# Or individually
npm run build-core
npm run build-ui
```

## Publishing

```bash
# Build and pack both libraries
npm run build-and-pack

# Publish core first
cd dist/acontplus-core && npm publish

# Then publish UI components
cd ../acontplus-ui-components && npm publish
```

## Configuration Details

### TypeScript Path Mapping

The root `tsconfig.json` includes path mappings that allow importing from source
during development:

- `acontplus-core` → `./projects/acontplus-core/src/public-api`
- `@acontplus-core` → `./projects/acontplus-core/src/public-api`

### Dependency Management

- **Workspace Dependencies**: Uses `workspace:*` protocol for internal packages
- **Development**: TypeScript project references and path mapping for fast
  builds
- **Production**: Published npm packages with proper peer dependencies
- **Automatic Linking**: npm workspaces automatically links internal
  dependencies

### Key Files

- `tsconfig.json`: Root TypeScript configuration with path mappings
- `projects/*/tsconfig.json`: Individual project configurations
- `projects/*/ng-package.json`: Angular library build configurations
- `projects/*/package.json`: Individual package configurations
