# API Response Handling in DDD Architecture

## Overview

The current implementation provides a standardized `ApiResponse<T>` interface
for consistent API communication, but **response transformation is handled at
the repository/use-case level** rather than automatically by interceptors. This
approach gives more control to developers while maintaining type safety and
consistent error handling.

## Current Implementation Status

### What the System Currently Does

1. **Defines standardized `ApiResponse<T>` interface** for type-safe API
   communication
2. **Provides notification handling** via interceptors for user feedback
3. **Handles HTTP context and correlation tracking** automatically
4. **Supports both legacy and modern API response formats**
5. **Repository layer manages response transformation** based on backend format

### What the Interceptor Currently Handles

The `api.interceptor.ts` in `@acontplus/ng-core` currently handles:

- **Toast notifications** based on response status and request type
- **Error handling** for critical HTTP-level errors (5xx, network errors)
- **Success/warning/error notifications** from `ApiResponse` objects
- **Skipping notifications** for specific requests via `HttpContext`

### Response Transformation Approach

Unlike the documentation's description, the current implementation does **not**
automatically standardize all responses. Instead:

- **Backend flexibility**: Supports various response formats from different
  backends
- **Repository responsibility**: Each repository handles response transformation
- **Use-case control**: Business logic layer controls data transformation
- **Type safety**: Strong typing with `ApiResponse<T>` interface

## Current Response Handling Patterns

### 1. Backend Returns ApiResponse<T> Format

**Backend Response:**

```json
{
  "status": "success",
  "code": "200",
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Repository Implementation:**

````typescript
### Repository Implementation

```typescript
@Injectable()
export class UserRepository extends GenericRepository<User, number> {
  constructor(http: HttpClient) {
    super(http, { baseUrl: '/api', endpoint: 'users' });
  }

  // Repository handles response transformation based on backend format
  getAll(
    pagination: PaginationParams,
  ): Observable<PagedResult<User>> {
    const params = this.buildParams(pagination);
    return this.get<PagedResult<User>>('', params);
  }

  create(entity: Partial<User>): Observable<User> {
    return this.post<User>('', entity);
  }

  update(id: number, entity: Partial<User>): Observable<User> {
    return this.put<User>(id.toString(), entity);
  }

  delete(id: number): Observable<void> {
    return this.delete<void>(id.toString());
  }
}
````

### Handling Different Backend Response Formats

```typescript
@Injectable()
export class LegacyUserRepository extends BaseHttpRepository {
  protected config = { baseUrl: '/api', endpoint: 'legacy-users' };

  // Handle legacy API format
  getAll(): Observable<User[]> {
    return this.get<LegacyApiResponse<User[]>>('').pipe(
      map(response => response.payload), // Extract data from legacy format
    );
  }

  // Handle modern API format
  createModern(entity: Partial<User>): Observable<User> {
    return this.post<ApiResponse<User>>('', entity).pipe(
      map(response => {
        if (response.status === 'success') {
          return response.data;
        }
        throw new Error(response.message);
      }),
    );
  }
}
```

### 2. Backend Returns Raw Data

**Backend Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Repository Implementation:**

```typescript
// Repository receives raw data directly
async getUser(id: number): Promise<User> {
  return await this.http.get<User>(`/users/${id}`).toPromise();
}
```

### 3. Backend Returns Legacy Format

**Backend Response:**

```json
{
  "code": "0",
  "message": "Success",
  "payload": {
    "id": 1,
    "name": "John Doe"
  }
}
```

**Repository Implementation:**

```typescript
// Repository transforms legacy format
async getLegacyData(): Promise<User> {
  const response = await this.http.get<LegacyApiResponse<User>>('/legacy-endpoint').toPromise();

  // Transform to current format
  return response.payload;
}
```

{ "status": "success", "code": "200", "message": "User deleted successfully" }

````

**Repository Receives:**

```typescript
// Full ApiResponse (interceptor preserves for context)
const response = await this.userRepository.delete(userId);
// response is ApiResponse structure with message
````

### 3. Warning Response

**Backend Response:**

```json
{
  "status": "warning",
  "message": "Operation completed with warnings",
  "data": { "id": 1, "name": "John" },
  "warnings": [{ "code": "FIELD_IGNORED", "message": "Some fields ignored" }]
}
```

**Interceptor Behavior:**

- Shows warning toast notification
- Returns data if present, otherwise full response

### 4. Error Response

**Backend Response:**

```json
{
  "status": "error",
  "code": "400",
  "message": "Validation failed",
  "errors": [{ "code": "EMAIL_INVALID", "message": "Invalid email" }]
}
```

**Interceptor Behavior:**

- Shows error toast notification
- Throws standardized error for use case handling

## Toast Control

### Automatic Behavior

The interceptor automatically determines whether to show success toast
notifications based on HTTP method and URL patterns:

- **Commands (POST, PUT, PATCH, DELETE)**: Show success toasts automatically
- **Queries (GET)**: Hide success toasts automatically (to avoid spam)
- **List/Search Operations**: Hide success toasts automatically
- **Health Checks**: Hide success toasts automatically

## Notification Handling

The `api.interceptor.ts` automatically handles user notifications based on API
responses:

### Success Notifications

- **POST/PUT/PATCH/DELETE**: Shows success toast if response includes a message
- **Excluded patterns**: GET requests, list/search/query endpoints, health
  checks
- **Configurable**: Can skip notifications using `HttpContext`

### Warning Notifications

- **Warning status**: Shows warning toasts for `status: 'warning'`
- **Warning details**: Displays individual warning messages from `warnings`
  array

### Error Notifications

- **Error status**: Shows error toasts for `status: 'error'`
- **Error details**: Displays individual error messages from `errors` array
- **HTTP errors**: Shows critical server errors (5xx) and network errors
- **Client errors**: 4xx errors are handled by components, not shown globally

### Skipping Notifications

```typescript
import { SKIP_NOTIFICATION } from '@acontplus/ng-infrastructure';

// Skip notifications for this request
this.http.post('/api/silent-operation', data, {
  context: new HttpContext().set(SKIP_NOTIFICATION, true),
});
```

## Implementation Examples

### Repository Pattern

```typescript
export class UserRepository extends BaseHttpRepository<User> {
  constructor(http: HttpClient) {
    super(http, '/api/users');
  }

  // The interceptor handles all standardization - repository is very simple
  getAll(pagination: PaginationParams): Observable<PaginatedResult<User>> {
    const params = this.buildQueryParams(pagination);
    return this.get<PaginatedResult<User>>(this.buildUrl(''), params);
  }

  create(entity: Omit<User, 'id'>): Observable<User> {
    return this.post<User>(this.buildUrl(''), entity);
  }

  update(id: number, entity: Partial<User>): Observable<User> {
    return this.put<User>(this.buildUrl(id.toString()), entity);
  }

  delete(id: number): Observable<boolean> {
    return this.deleteHttp<boolean>(this.buildUrl(id.toString()));
  }
}
```

### Use Case Implementation

```typescript
@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDto, User> {
  constructor(private userRepository: UserRepository) {}

  execute(dto: CreateUserDto): Observable<User> {
    // Repository handles the HTTP call and response transformation
    return this.userRepository.create(dto).pipe(
      // Additional business logic can be applied here
      map(user => {
        // Validate business rules
        if (!user.email.includes('@')) {
          throw new Error('Invalid email format');
        }
        return user;
      }),
      catchError(error => {
        // Handle business logic errors
        if (error.message.includes('duplicate')) {
          throw new Error('User with this email already exists');
        }
        throw error;
      }),
    );
  }
}
```

### Component/Service Usage

```typescript
@Component({...})
export class UserFormComponent {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private notificationService: NotificationService
  ) {}

  onSubmit(userData: CreateUserDto) {
    this.createUserUseCase.execute(userData).subscribe({
      next: (user) => {
        // Success handling - notifications shown by interceptor
        this.router.navigate(['/users', user.id]);
      },
      error: (error) => {
        // Error handling - notifications shown by interceptor
        console.error('Failed to create user:', error);
      }
    });
  }
}
      map(response => {
        // Handle different response scenarios
        if (this.hasDataInResponse(response)) {
          return {
            success: true,
            userId: request.id,
            message:
              this.extractMessageFromApiResponse(response) ||
              'User deleted successfully',
          };
        } else if (this.hasMessageInResponse(response)) {
          return {
            success: true,
            userId: request.id,
            message: this.extractMessageFromApiResponse(response),
          };
        } else {
          return {
            success: true,
            userId: request.id,
            message: 'User deleted successfully',
          };
        }
      }),
      catchError(error => {
        return throwError(() => this.mapRepositoryError(error, request.id));
      }),
    );
  }
}
```

## Benefits of Standardization

## Current Benefits

### 1. **Type Safety with ApiResponse<T>**

- Strongly typed API responses using `ApiResponse<T>` interface
- Clear contract between frontend and backend
- Support for errors, warnings, and metadata

### 2. **Flexible Response Handling**

- Supports multiple backend response formats
- Repository-level control over response transformation
- Backward compatibility with legacy APIs

### 3. **Automatic Notification Management**

- Smart toast notifications via interceptor
- Configurable notification behavior
- Consistent user feedback across the application

### 4. **HTTP Context and Correlation**

- Automatic request correlation tracking
- Tenant and authentication header management
- Comprehensive request logging and error tracking

### 5. **Error Categorization**

- Structured error responses with severity levels
- Detailed error information and suggested actions
- Proper error handling at component level

## Future Enhancements

### Planned Response Standardization

The system is designed to eventually support automatic response transformation:

```typescript
// Future: Automatic transformation in interceptor
map((event: HttpEvent<any>) => {
  if (event instanceof HttpResponse) {
    return standardizeResponse(event);
  }
  return event;
});

// Where standardizeResponse wraps any response format into ApiResponse<T>
function standardizeResponse(event: HttpResponse): HttpResponse {
  const body = event.body;
  if (isApiResponse(body)) {
    return event; // Already standardized
  }
  // Wrap raw data into ApiResponse format
  const standardized = {
    status: 'success',
    code: '200',
    message: 'Operation completed successfully',
    data: body,
    timestamp: new Date().toISOString(),
  };
  return event.clone({ body: standardized });
}
```

## Backend Integration

### C# Backend (Your Current Setup)

Your C# backend's automatic message generation works perfectly:

```csharp
// These are automatically handled by the interceptor
ApiResponse<User>.Success(user); // "Operation completed successfully."
ApiResponse.Success(); // "Operation completed successfully."
ApiResponse<User>.Success(user, new ApiResponseOptions {
    Message = "User created successfully"
});
```

### Other Backend Formats

The interceptor handles various backend response formats:

```typescript
// Raw data (no wrapper)
{ id: 1, name: "John" }

// Simple success response
{ success: true, data: {...} }

// Custom format
{ result: {...}, message: "Success" }

// All are standardized to ApiResponse format
```

## Best Practices

### Current Implementation

1. **Use ApiResponse<T> interface** for type-safe API communication
2. **Handle response transformation in repositories** based on backend format
3. **Leverage automatic notifications** from the interceptor
4. **Use HttpContext for correlation tracking** and tenant management
5. **Structure repositories for flexibility** to handle different backend
   formats
6. **Implement proper error handling** at the use case and component levels
7. **Use SKIP_NOTIFICATION context** for silent operations when needed

### Repository Patterns

```typescript
// Pattern 1: Modern API with ApiResponse
export class ModernRepository extends GenericRepository<User> {
  create(user: CreateUserDto): Observable<User> {
    return this.post<ApiResponse<User>>('', user).pipe(
      map(response => response.data),
    );
  }
}

// Pattern 2: Legacy API transformation
export class LegacyRepository extends BaseHttpRepository {
  getData(): Observable<Data> {
    return this.get<LegacyApiResponse<Data>>('').pipe(
      map(response => response.payload),
    );
  }
}
```

### Future Standardization

When automatic response transformation is implemented:

1. **Trust the interceptor** - All responses will be standardized automatically
2. **Simplify repositories** - Focus purely on business logic
3. **Use consistent HTTP methods** - Follow REST conventions
4. **Handle special cases at use case level** - For custom messaging
   requirements
5. **Structure APIs consistently** - Use standard URL patterns
6. **Let the interceptor handle errors** - Centralized error handling and
   display
