# Application Entity Example

This example demonstrates a complete implementation of an Application entity using the acontplus-core library patterns, including base use cases, base repositories, and comprehensive UI components.

## Overview

The Application entity represents a software application with properties like name, version, status, environment, and deployment information. This example showcases:

- **Domain Model**: Clean entity definition extending BaseEntity
- **Repository Pattern**: HTTP-based repository extending BaseRepository
- **Use Case Pattern**: Business logic using CompositeUseCase
- **UI Components**: Modern Angular Material-based interface
- **Mock Service**: Demonstration data without external dependencies

## Architecture

### 1. Domain Model (`application.ts`)

```typescript
export interface Application extends BaseEntity {
  name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'maintenance' | 'deprecated';
  category: string;
  owner: string;
  environment: 'development' | 'staging' | 'production';
  lastDeployed?: string;
  dependencies: string[];
  tags: string[];
  isPublic: boolean;
  repositoryUrl?: string;
  documentationUrl?: string;
}
```

**Key Features:**

- Extends `BaseEntity` for consistent ID and timestamp handling
- Strong typing with union types for status and environment
- Flexible arrays for dependencies and tags
- Optional fields for URLs and deployment info

### 2. Repository Layer (`application.repository.ts`)

```typescript
export class ApplicationRepository extends BaseRepository<Application> {
  protected entityName = 'applications';
  protected baseUrl = 'https://api.example.com/v1';

  // Override base methods for custom implementations
  override getAll(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<Application>>;
  override getById(id: number): Observable<Application>;
  override create(application: Omit<Application, 'id'>): Observable<Application>;
  // ... more methods
}
```

**Key Features:**

- Extends `BaseRepository<Application>` for standard CRUD operations
- Overrides base methods to provide specific implementations
- Uses `entityName` and `baseUrl` for dynamic URL building
- Implements application-specific methods (deploy, addDependency, etc.)

### 3. Use Case Layer (`application-management.use-case.ts`)

```typescript
export class ApplicationManagementUseCase extends CompositeUseCase<
  ApplicationManagementRequest,
  ApplicationManagementResponse
> {
  constructor(private applicationRepository: ApplicationRepository) {
    super();
  }

  protected executeInternal(
    request: ApplicationManagementRequest,
  ): Observable<ApplicationManagementResponse> {
    // Route to appropriate handler based on action
  }
}
```

**Key Features:**

- Extends `CompositeUseCase` for complex business operations
- Implements action-based routing for different operations
- Provides public methods for external consumption
- Handles validation and error responses

### 4. Mock Service (`mock-application.service.ts`)

```typescript
export class MockApplicationService {
  private applications: Application[] = [
    // Sample data for demonstration
  ];

  // Implements all repository methods with mock data
  getAll(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<Application>>;
  // ... more methods
}
```

**Key Features:**

- Provides realistic sample data for 8 different applications
- Implements all repository methods with mock implementations
- Simulates HTTP delays for realistic user experience
- Supports filtering, sorting, and pagination

### 5. UI Component (`application.component.ts`)

```typescript
@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    /* Material Design modules */
  ],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit, OnDestroy {
  // Comprehensive application management interface
}
```

**Key Features:**

- Standalone Angular component with Material Design
- Reactive forms for create/edit operations
- Advanced filtering and search capabilities
- Responsive design with mobile support
- Real-time statistics dashboard

## Usage Examples

### Creating an Application

```typescript
// Using the use case
const newApp = await this.applicationUseCase
  .createApplication({
    name: 'New App',
    description: 'Description here',
    version: '1.0.0',
    status: 'active',
    category: 'Web App',
    owner: 'Team Name',
    environment: 'development',
    isPublic: false,
    dependencies: [],
    tags: [],
  })
  .toPromise();
```

### Filtering Applications

```typescript
// Get applications by status
const activeApps = await this.applicationUseCase
  .getApplicationsByStatus('active', { page: 1, pageSize: 10 })
  .toPromise();

// Search applications
const searchResults = await this.applicationUseCase
  .searchApplications('portal', { page: 1, pageSize: 10 })
  .toPromise();
```

### Updating Application Status

```typescript
// Deploy to production
const deployedApp = await this.applicationUseCase
  .deployApplication(appId, 'production')
  .toPromise();

// Update status
const updatedApp = await this.applicationUseCase
  .updateApplicationStatus(appId, 'maintenance')
  .toPromise();
```

## Features Demonstrated

### 1. Base Repository Pattern

- **Inheritance**: Extends `BaseRepository<T>` for consistent CRUD operations
- **URL Building**: Dynamic endpoint construction using `entityName`
- **Error Handling**: Centralized HTTP error handling through base class
- **Method Overriding**: Custom implementations while maintaining base contract

### 2. Use Case Pattern

- **Composite Use Case**: Extends `CompositeUseCase` for complex operations
- **Action Routing**: Request-based routing to appropriate handlers
- **Response Standardization**: Consistent response format across operations
- **Public API**: Clean interface for external consumption

### 3. Domain-Driven Design

- **Entity Definition**: Clear domain model with business rules
- **Value Objects**: Strong typing for status, environment, and other enums
- **Business Logic**: Centralized in use case layer
- **Repository Abstraction**: Clean separation of concerns

### 4. Modern Angular Patterns

- **Standalone Components**: Modern Angular architecture
- **Reactive Forms**: Form validation and handling
- **Observable Pattern**: RxJS-based data flow
- **Material Design**: Professional UI components

### 5. Testing and Development

- **Mock Services**: Development without external dependencies
- **Sample Data**: Realistic data for UI testing
- **Error Simulation**: Network delay simulation
- **Comprehensive Coverage**: All CRUD operations implemented

## Benefits of This Pattern

1. **Consistency**: Follows established acontplus-core patterns
2. **Maintainability**: Clear separation of concerns
3. **Testability**: Easy to mock and test individual layers
4. **Scalability**: Easy to extend with new features
5. **Reusability**: Repository and use case patterns can be applied to other entities

## Next Steps

To extend this example:

1. **Add Real HTTP Backend**: Replace mock service with actual API calls
2. **Implement Caching**: Add caching layer for performance
3. **Add Authentication**: Implement user authorization and permissions
4. **Extend Validation**: Add more sophisticated business rule validation
5. **Add Notifications**: Implement real-time updates and notifications

## Dependencies

- `@acontplus-core`: Base classes and interfaces
- `@angular/material`: UI components
- `@angular/forms`: Reactive forms
- `rxjs`: Observable patterns

This example provides a solid foundation for building enterprise applications using the acontplus-core library patterns.
