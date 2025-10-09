# @acontplus/ng-config

Angular configuration library for AcontPlus applications, providing environment
configuration, authentication constants, and app configuration services.

## Installation

```bash
npm install @acontplus/ng-config
```

## Features

- **Environment Configuration**: Type-safe environment token for dependency
  injection
- **Authentication Constants**: Predefined constants for authentication settings
- **App Configuration Service**: Service for managing application-wide
  configuration
- **Angular Integration**: Seamless integration with Angular's dependency
  injection system
- **TypeScript Support**: Full type safety with comprehensive TypeScript
  definitions

## Usage

### Environment Configuration

```typescript
import { ENVIRONMENT } from '@acontplus/ng-config';

@Component({...})
export class MyComponent {
  constructor(@Inject(ENVIRONMENT) private environment: Environment) {
    console.log(this.environment.apiUrl);
  }
}
```

### App Configuration Service

```typescript
import { AppConfigService } from '@acontplus/ng-config';

@Component({...})
export class MyComponent {
  constructor(private appConfig: AppConfigService) {
    const config = this.appConfig.getConfig();
  }
}
```

### Authentication Constants

```typescript
import { AUTH_API } from '@acontplus/ng-config';

const authEndpoint = AUTH_API.AUTH;
```

## Running unit tests

Run `nx test ng-config` to execute the unit tests.
