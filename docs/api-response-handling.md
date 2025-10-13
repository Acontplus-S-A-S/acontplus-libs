# API Response Handling in DDD Architecture

## Overview

The system provides automatic API response standardization through the
`apiInterceptor` in `@acontplus/ng-infrastructure`. All HTTP responses are
automatically transformed to follow the `ApiResponse<T>` interface, ensuring
consistent API communication, type safety, and automatic notification handling
across the application.

## Current Implementation Status

### What the System Does

1. **Automatic Response Standardization** - All responses are transformed to
   `ApiResponse<T>` format
2. **Smart Notification Handling** - Automatic toast notifications based on
   response status and request type
3. **HTTP Context Management** - Correlation tracking and tenant management
4. **Multi-Format Support** - Handles ApiResponse format, raw data, and legacy
   formats
5. **Error Handling** - Comprehensive error handling with user-friendly
   notifications

### What the Interceptor Handles

The `api-interceptor.ts` in `@acontplus/ng-infrastructure` automatically:

- **Standardizes all responses** to `ApiResponse<T>` format
- **Shows toast notifications** based on response status and request type
- **Handles errors** for critical HTTP-level errors (5xx, network errors)
- **Transforms responses** for consumers (extracts data from success responses)
- **Supports notification control** via `HttpContext` tokens
- **Retries failed requests** up to 2 times with 1-second delay

### Response Transformation Approach

The interceptor automatically standardizes ALL responses:

- **ApiResponse format**: Passes through unchanged
- **Raw data**: Wrapped in ApiResponse structure
- **Primitive values**: Wrapped in ApiResponse structure
- **Null/undefined**: Creates success response without data
- **Type safety**: Strong typing with `ApiResponse<T>` interface

## Response Handling Patterns

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

**What Happens:**

1. Interceptor recognizes valid ApiResponse format
2. Shows success notification (if POST/PUT/PATCH/DELETE)
3. Extracts and returns `data` to repository

**BaseRepository Receives:**

```typescript
// BaseRepository receives the extracted data directly
const user: User = await this.http
  .post<User>('/api/users', userData)
  .toPromise();
// user = { id: 1, name: "John Doe", email: "john@example.com" }
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

**What Happens:**

1. Interceptor wraps raw data in ApiResponse structure
2. Shows success notification (if POST/PUT/PATCH/DELETE)
3. Returns the data directly to repository

**BaseRepository Receives:**

```typescript
// BaseRepository receives the data directly (interceptor unwraps it)
const user: User = await this.http.get<User>('/api/users/1').toPromise();
// user = { id: 1, name: "John Doe", email: "john@example.com" }
```

### 3. Backend Returns Message-Only Response

**Backend Response:**

```json
{
  "status": "success",
  "code": "200",
  "message": "User deleted successfully"
}
```

**What Happens:**

1. Interceptor recognizes ApiResponse without data
2. Shows success notification with message
3. Returns full ApiResponse to repository

**BaseRepository Receives:**

```typescript
// BaseRepository receives full ApiResponse when no data present
const response: ApiResponse = await this.http
  .delete('/api/users/1')
  .toPromise();
// response = { status: "success", code: "200", message: "User deleted successfully", ... }
```

### 5. Error Response

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

The `api-interceptor.ts` automatically handles user notifications based on API
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

### BaseRepository Pattern

```typescript
@Injectable()
export class UserRepository extends GenericRepository<User, number> {
  constructor(http: HttpClient) {
    super(http, { baseUrl: '/api', endpoint: 'users' });
  }

  // The interceptor handles all standardization - repository is very simple
  getAll(pagination: PaginationParams): Observable<PagedResult<User>> {
    const params = this.buildParams(pagination);
    return this.get<PagedResult<User>>('', params);
    // Interceptor automatically extracts data from ApiResponse
  }

  create(entity: Partial<User>): Observable<User> {
    return this.post<User>('', entity);
    // Interceptor shows success notification and extracts data
  }

  update(id: number, entity: Partial<User>): Observable<User> {
    return this.put<User>(id.toString(), entity);
    // Interceptor shows success notification and extracts data
  }

  delete(id: number): Observable<void> {
    return this.delete<void>(id.toString());
    // Interceptor shows success notification
  }
}
```

### Use Case Implementation

```typescript
@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDto, User> {
  constructor(private userRepository: UserRepository) {}

  execute(dto: CreateUserDto): Observable<User> {
    // BaseRepository handles the HTTP call and response transformation
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

```

## Benefits of Automatic Standardization

### 1. **Type Safety with ApiResponse<T>**

- Strongly typed API responses using `ApiResponse<T>` interface
- Clear contract between frontend and backend
- Support for errors, warnings, and metadata

### 2. **Flexible Response Handling**

- Supports multiple backend response formats
- BaseRepository-level control over response transformation
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

## Advanced Features

### Response Standardization Logic

The interceptor uses the following logic to standardize responses:

```typescript
function standardizeApiResponse(body: unknown): ApiResponse<unknown> {
  // If it's already a proper ApiResponse, return as is
  if (isValidApiResponse(body)) {
    return body;
  }

  // If it's a raw data response (no wrapper), wrap it
  if (body && typeof body === 'object' && !('status' in body)) {
    return {
      status: 'success',
      code: '200',
      message: 'Operation completed successfully',
      data: body,
      timestamp: new Date().toISOString(),
    };
  }

  // If it's a primitive value, wrap it
  if (body !== null && body !== undefined && typeof body !== 'object') {
    return {
      status: 'success',
      code: '200',
      message: 'Operation completed successfully',
      data: body,
      timestamp: new Date().toISOString(),
    };
  }

  // If it's null/undefined, create a success response without data
  return {
    status: 'success',
    code: '200',
    message: 'Operation completed successfully',
    timestamp: new Date().toISOString(),
  };
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

### Working with the Interceptor

1. **Trust the interceptor** - All responses are automatically standardized
2. **Type your responses** - Use the expected data type, not ApiResponse<T>
3. **Leverage automatic notifications** - The interceptor handles user feedback
4. **Use HttpContext tokens** - Control notification behavior when needed
5. **Keep repositories simple** - Focus on business logic, not response handling
6. **Handle errors at component level** - Interceptor shows critical errors only

### BaseRepository Patterns

```typescript
// ✅ Correct: Type with expected data, interceptor handles unwrapping
@Injectable()
export class UserRepository extends GenericRepository<User, number> {
  create(user: CreateUserDto): Observable<User> {
    return this.post<User>('', user);
    // Interceptor automatically:
    // 1. Standardizes response
    // 2. Shows success notification
    // 3. Extracts and returns data
  }

  getAll(): Observable<User[]> {
    return this.get<User[]>('');
    // Interceptor automatically:
    // 1. Standardizes response
    // 2. Skips notification (GET request)
    // 3. Extracts and returns data
  }
}

// ✅ Correct: Silent operation
export class SilentRepository {
  updateSettings(settings: Settings): Observable<Settings> {
    return this.http.put<Settings>('/api/settings', settings, {
      context: new HttpContext().set(SKIP_NOTIFICATION, true),
    });
    // Interceptor skips notification but still standardizes
  }
}

// ❌ Incorrect: Don't manually handle ApiResponse
export class WrongRepository {
  create(user: CreateUserDto): Observable<User> {
    return this.post<ApiResponse<User>>('', user).pipe(
      map(response => response.data), // Unnecessary - interceptor does this
    );
  }
}
```

### Notification Control

```typescript
// Skip notifications for specific requests
import { SKIP_NOTIFICATION } from '@acontplus/ng-infrastructure';

this.http.post('/api/silent-operation', data, {
  context: new HttpContext().set(SKIP_NOTIFICATION, true),
});

// Force notifications for GET requests
import { SHOW_NOTIFICATIONS } from '@acontplus/ng-infrastructure';

this.http.get('/api/important-data', {
  context: new HttpContext().set(SHOW_NOTIFICATIONS, true),
});
```

### Error Handling

```typescript
// Component handles business logic errors
@Component({...})
export class UserFormComponent {
  onSubmit(userData: CreateUserDto) {
    this.createUserUseCase.execute(userData).subscribe({
      next: (user) => {
        // Success - notification already shown by interceptor
        this.router.navigate(['/users', user.id]);
      },
      error: (error) => {
        // Handle business logic errors
        // Critical errors already shown by interceptor
        if (error.status === 400) {
          this.form.setErrors({ validation: error.message });
        }
      }
    });
  }
}
```
