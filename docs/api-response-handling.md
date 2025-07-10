# API Response Handling in DDD Architecture

## Overview

The API interceptor has been improved to handle different response scenarios while maintaining DDD principles. This document explains how different types of API responses are processed and how to handle them in your use cases.

## Response Scenarios

### 1. Success with Data

**API Response:**
```json
{
  "status": "success",
  "code": "200",
  "message": "User created successfully.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Interceptor Behavior:**
- Shows success toastr notification with the message (if enabled)
- Extracts and returns only the `data` object
- Repository receives the user entity directly

**Use Case Usage:**
```typescript
// Repository returns User entity directly
const user = await this.userRepository.create(userData);
// user is User entity, not ApiResponse<User>
```

### 2. Success with Message Only (No Data)

**API Response:**
```json
{
  "status": "success",
  "code": "200",
  "message": "User deleted successfully.",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Interceptor Behavior:**
- Shows success toastr notification with the message (if enabled)
- Returns the full response object (preserves metadata, correlationId, etc.)
- Repository receives the full ApiResponse structure

**Use Case Usage:**
```typescript
// Repository returns full response
const response = await this.userRepository.delete(userId);

// Check if response has data or just message
if (this.hasDataInResponse(response)) {
  // Handle data
  const data = this.extractData(response);
} else if (this.hasMessageInResponse(response)) {
  // Handle success message
  const message = this.extractMessage(response);
  // Return custom result
  return { success: true, message, userId };
}
```

### 3. Warning Response

**API Response:**
```json
{
  "status": "warning",
  "code": "200",
  "message": "Operation completed with warnings.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "warnings": [
    {
      "code": "FIELD_IGNORED",
      "message": "Some fields were ignored during update"
    }
  ],
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Interceptor Behavior:**
- Shows warning toastr notification
- Returns the data if present, otherwise the full response

### 4. Error Response

**API Response:**
```json
{
  "status": "error",
  "code": "400",
  "message": "An error occurred.",
  "errors": [
    {
      "code": "EMAIL_INVALID",
      "message": "Email format is invalid",
      "target": "email"
    }
  ],
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Interceptor Behavior:**
- Shows error toastr notification
- Throws the error for use case handling

## Toast Control

### Automatic Behavior

The interceptor automatically determines whether to show success toast notifications based on HTTP method and URL patterns:

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

### Customizing Toast Behavior

If you need to customize toast behavior for specific cases, you can:

1. **Handle at the use case level** - Suppress toasts in your use case logic
2. **Use different endpoint patterns** - Structure your API to follow the automatic detection
3. **Create custom interceptors** - For very specific requirements

### Example Usage

```typescript
// Commands - toasts shown automatically
create(entity: Omit<User, 'id'>): Observable<User> {
  return this.post<User>(this.buildUrl(''), entity);
  // ✅ Shows "User created successfully"
}

update(id: number, entity: Partial<User>): Observable<User> {
  return this.put<User>(this.buildUrl(id.toString()), entity);
  // ✅ Shows "User updated successfully"
}

delete(id: number): Observable<boolean> {
  return this.deleteHttp<boolean>(this.buildUrl(id.toString()));
  // ✅ Shows "User deleted successfully"
}

// Queries - toasts hidden automatically
getAll(pagination: PaginationParams, filters?: FilterParams): Observable<PaginatedResult<User>> {
  const params = this.buildQueryParams(pagination, filters);
  return this.get<PaginatedResult<User>>(this.buildUrl(''), params);
  // ✅ No toast (GET request)
}

getById(id: number): Observable<User> {
  return this.get<User>(this.buildUrl(id.toString()));
  // ✅ No toast (GET request)
}

search(query: string, pagination: PaginationParams): Observable<PaginatedResult<User>> {
  const params = { ...this.buildQueryParams(pagination), search: query };
  return this.get<PaginatedResult<User>>(this.buildUrl('search'), params);
  // ✅ No toast (GET request with search endpoint)
}
```

### Handling Special Cases

For operations that might need custom toast behavior:

```typescript
// In your use case, you can handle custom messaging
@Injectable()
export class BulkDeleteCommand extends DeleteCommand {
  execute(request: { ids: number[] }): Observable<DeleteResult> {
    return this.userRepository.bulkDelete(request.ids).pipe(
      map((response) => {
        // Custom handling for bulk operations
        return {
          success: true,
          message: `Successfully deleted ${request.ids.length} users`,
          deletedCount: request.ids.length
        };
      }),
      catchError((error) => {
        return throwError(() => this.mapRepositoryError(error));
      }),
    );
  }
}
```

## Implementation Examples

### Command with Data Response

```typescript
@Injectable()
export class CreateUserCommand extends CreateCommand<User> {
  execute(request: Omit<User, 'id'>): Observable<User> {
    return this.userRepository.create(request).pipe(
      map((user) => {
        // user is already the User entity (data extracted by interceptor)
        return user;
      }),
      catchError((error) => {
        return throwError(() => this.mapRepositoryError(error));
      }),
    );
  }
}
```

### Command with Message Response

```typescript
@Injectable()
export class DeleteUserCommand extends DeleteCommand {
  execute(request: { id: number }): Observable<DeleteUserResult> {
    return this.userRepository.delete(request.id).pipe(
      map((response) => {
        // Handle different response scenarios
        if (this.hasDataInResponse(response)) {
          return {
            success: true,
            userId: request.id,
            message: this.extractMessageFromApiResponse(response) || 'User deleted successfully'
          };
        } else if (this.hasMessageInResponse(response)) {
          return {
            success: true,
            userId: request.id,
            message: this.extractMessageFromApiResponse(response)
          };
        } else {
          return {
            success: true,
            userId: request.id,
            message: 'User deleted successfully'
          };
        }
      }),
      catchError((error) => {
        return throwError(() => this.mapRepositoryError(error, request.id));
      }),
    );
  }
}
```

### Query with Data Response (No Toast)

```typescript
@Injectable()
export class GetUsersQuery extends Query<GetUsersRequest, PaginatedResult<User>> {
  execute(request: GetUsersRequest): Observable<PaginatedResult<User>> {
    return this.userRepository.getAll(request.pagination, request.filters).pipe(
      map((result) => {
        // result is already PaginatedResult<User> (data extracted by interceptor)
        // No success toast shown for list operations
        return result;
      }),
      catchError((error) => {
        return throwError(() => this.mapRepositoryError(error));
      }),
    );
  }
}
```

## Backend Integration

### C# Backend Automatic Messages

Your C# backend automatically generates messages when none are provided:

```csharp
// Success with data - shows "Operation completed successfully."
ApiResponse<User> response = ApiResponse<User>.Success(user);

// Success with custom message
ApiResponse<User> response = ApiResponse<User>.Success(user, new ApiResponseOptions 
{ 
    Message = "User created successfully" 
});

// Success without data - shows "Operation completed successfully."
ApiResponse response = ApiResponse.Success();
```

### Frontend Handling

The interceptor handles these automatic messages appropriately:

- **List/Query Operations**: Automatic messages are suppressed (no toast shown)
- **Command Operations**: Automatic messages are shown as success toasts
- **Custom Messages**: Always shown regardless of operation type

## Helper Methods

The `BaseUseCase` class provides helper methods for response handling:

- `extractData<T>(response)`: Extracts data from response
- `extractMessage(response)`: Extracts message from response
- `hasDataInResponse(response)`: Checks if response contains data
- `hasMessageInResponse(response)`: Checks if response contains message

## Benefits

1. **Consistent Error Handling**: All HTTP errors are handled centrally
2. **Smart Success Notifications**: Success messages are shown automatically for appropriate operations
3. **Flexible Response Handling**: Supports both data and message-only responses
4. **DDD Compliance**: Maintains separation of concerns
5. **Type Safety**: Proper TypeScript types for different response scenarios
6. **Backend Integration**: Works seamlessly with C# automatic message generation

## Best Practices

1. **Use data responses** for operations that return entities (GET, POST, PUT)
2. **Use message responses** for operations that don't return data (DELETE, some PATCH)
3. **Rely on automatic detection** - The interceptor handles toast behavior intelligently
4. **Structure your API consistently** - Use standard HTTP methods and URL patterns
5. **Handle special cases at use case level** - For custom messaging requirements
6. **Handle both scenarios** in your use cases using the helper methods
7. **Preserve metadata** when needed by checking response structure
8. **Map domain errors** appropriately in your error handling 
