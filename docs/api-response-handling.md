# API Response Handling in DDD Architecture

## Overview

The API interceptor now **standardizes all responses** to follow a consistent
`ApiResponse<T>` structure, making the handling more predictable and robust.
This approach ensures that regardless of how your backend returns data, the
frontend always receives a consistent format.

## Response Standardization

### What the Interceptor Does

The interceptor automatically standardizes all HTTP responses:

1. **Wraps raw data** into proper `ApiResponse` structure
2. **Handles different response formats** from various backends
3. **Standardizes error responses** for consistent error handling
4. **Manages toast notifications** based on response type and request method
5. **Transforms responses** for consumers (repositories, use cases)

### Standardization Rules

```typescript
// Raw data response → Standardized
{ id: 1, name: "John" }
// ↓
{
  status: 'success',
  code: '200',
  message: 'Operation completed successfully',
  data: { id: 1, name: "John" },
  timestamp: '2024-01-01T00:00:00Z'
}

// Primitive value → Standardized
true
// ↓
{
  status: 'success',
  code: '200',
  message: 'Operation completed successfully',
  data: true,
  timestamp: '2024-01-01T00:00:00Z'
}

// Already standardized → Unchanged
{
  status: 'success',
  code: '200',
  message: 'User created successfully',
  data: { id: 1, name: "John" }
}
// ↓ (remains unchanged)
```

## Response Scenarios

### 1. Success with Data

**Backend Response (any format):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Interceptor Standardization:**

```json
{
  "status": "success",
  "code": "200",
  "message": "Operation completed successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Repository Receives:**

```typescript
// Direct data object (interceptor extracts data)
const user = await this.userRepository.create(userData);
// user is User entity, not ApiResponse<User>
```

### 2. Success with Message Only

**Backend Response:**

```json
{
  "status": "success",
  "code": "200",
  "message": "User deleted successfully"
}
```

**Repository Receives:**

```typescript
// Full ApiResponse (interceptor preserves for context)
const response = await this.userRepository.delete(userId);
// response is ApiResponse structure with message
```

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

### When Toasts Are Shown

✅ **Automatically shown for:**

- POST requests (create operations)
- PUT requests (update operations)
- PATCH requests (partial updates)
- DELETE requests (delete operations)

❌ **Automatically hidden for:**

- GET requests (queries/lists)
- URLs containing `/list`, `/search`, `/query`
- URLs containing `/page`, `/paginated`
- URLs containing `/health`, `/status`, `/ping`

## Implementation Examples

### Repository (Simplified)

```typescript
export class UserRepository extends BaseHttpRepository<User> {
  constructor(http: HttpClient) {
    super(http, '/api/users');
  }

  // The interceptor handles all standardization - repository is very simple
  getAll(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<User>> {
    const params = this.buildQueryParams(pagination, filters);
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

### Use Case (Handles Different Response Types)

```typescript
@Injectable()
export class DeleteUserCommand extends DeleteCommand {
  execute(request: { id: number }): Observable<DeleteUserResult> {
    return this.userRepository.delete(request.id).pipe(
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

### 1. **Consistent Response Format**

- All responses follow the same structure
- No need to handle different response formats in repositories
- Predictable data flow throughout the application

### 2. **Backend Flexibility**

- Works with any backend response format
- Automatically wraps raw data into proper structure
- Handles legacy APIs that don't follow standard format

### 3. **Simplified Repositories**

- Repository methods are much simpler
- No complex response extraction logic
- Focus on business logic, not HTTP details

### 4. **Better Error Handling**

- Consistent error format across all endpoints
- Proper error categorization and severity levels
- Centralized error display logic

### 5. **Automatic Toast Management**

- Smart toast notifications based on operation type
- No manual toast configuration needed
- Consistent user experience

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

1. **Rely on automatic standardization** - The interceptor handles everything
2. **Keep repositories simple** - Focus on business logic, not HTTP details
3. **Use consistent HTTP methods** - Follow REST conventions for automatic
   detection
4. **Handle special cases at use case level** - For custom messaging
   requirements
5. **Structure your API consistently** - Use standard URL patterns for automatic
   detection
6. **Let the interceptor handle errors** - Centralized error handling and
   display
7. **Trust the standardization** - All responses are guaranteed to follow
   ApiResponse format
