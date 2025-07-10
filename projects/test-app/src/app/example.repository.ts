// Example concrete implementation
import {
  BaseRepository,
  FilterParams,
  PaginatedResult,
  PaginationParams,
} from '@acontplus-core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class ExampleRepository extends BaseRepository<any> {
  constructor(http: HttpClient) {
    super(http, '/api/examples');
  }

  getAll(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<any>> {
    const params = this.buildQueryParams(pagination, filters);
    // Toast automatically hidden for GET requests (list operations)
    return this.get<PaginatedResult<any>>(this.buildUrl(''), params);
  }

  getById(id: number): Observable<any> {
    // Toast automatically hidden for GET requests (single entity retrieval)
    return this.get<any>(this.buildUrl(id.toString()));
  }

  create(entity: Omit<any, 'id'>): Observable<any> {
    // Toast automatically shown for POST requests (create operations)
    return this.post<any>(this.buildUrl(''), entity);
  }

  update(id: number, entity: Partial<any>): Observable<any> {
    // Toast automatically shown for PUT requests (update operations)
    return this.put<any>(this.buildUrl(id.toString()), entity);
  }

  delete(id: number): Observable<boolean> {
    // Toast automatically shown for DELETE requests (delete operations)
    return this.deleteHttp<boolean>(this.buildUrl(id.toString()));
  }

  search(
    query: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<any>> {
    const params = {
      ...this.buildQueryParams(pagination),
      search: query,
    };
    // Toast automatically hidden for GET requests (search operations)
    return this.get<PaginatedResult<any>>(this.buildUrl('search'), params);
  }

  // Example of a command that might want to suppress toast
  // Note: For cases where you need to suppress toasts, you would need to handle this
  // at the use case level or create a custom interceptor for specific endpoints
  bulkDelete(ids: number[]): Observable<boolean> {
    // Toast automatically shown for POST requests
    // If you need to suppress this, consider using a different endpoint pattern
    // or handle it at the use case level
    return this.post<boolean>(this.buildUrl('bulk-delete'), { ids });
  }

  // Example of a command that wants to show custom toast
  importData(data: any[]): Observable<any> {
    // Toast automatically shown for POST requests
    return this.post<any>(this.buildUrl('import'), { data });
  }
}
