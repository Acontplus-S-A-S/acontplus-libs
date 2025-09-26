import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplicationFilterParams } from '../domain/application';
import { PagedResult as PaginatedResult, PaginationParams } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationRepository {
  private http = inject(HttpClient);

  protected entityName = 'aplicaciones';

  // Override base methods to use mock service for demonstration
  getAll(
    pagination: PaginationParams,
    filters?: ApplicationFilterParams,
  ): Observable<PaginatedResult<Application>> {
    let params = new HttpParams()
      .set('page', pagination.pageIndex.toString())
      .set('size', pagination.pageSize.toString());
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.environment) params = params.set('environment', filters.environment);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.isPublic !== undefined) params = params.set('isPublic', filters.isPublic.toString());
    }
    return this.http.get<PaginatedResult<Application>>(`${this.entityName}`, { params });
  }

  get(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.entityName}`);
  }

  getById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.entityName}/${id}`);
  }

  create(application: Omit<Application, 'id'>): Observable<Application> {
    return this.http.post<Application>(`${this.entityName}`, application);
  }

  update(id: number, application: Partial<Application>): Observable<Application> {
    return this.http.put<Application>(`${this.entityName}/${id}`, application);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.entityName}/${id}`);
  }

  search(
    query: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', pagination.pageIndex.toString())
      .set('size', pagination.pageSize.toString());
    return this.http.get<PaginatedResult<Application>>(`${this.entityName}/search`, { params });
  }

  // Application-specific methods
  getByStatus(
    status: Application['status'],
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', pagination.pageIndex.toString())
      .set('size', pagination.pageSize.toString());
    return this.http.get<PaginatedResult<Application>>(`${this.entityName}`, { params });
  }

  getByEnvironment(
    environment: Application['environment'],
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    const params = new HttpParams()
      .set('environment', environment)
      .set('page', pagination.pageIndex.toString())
      .set('size', pagination.pageSize.toString());
    return this.http.get<PaginatedResult<Application>>(`${this.entityName}`, { params });
  }

  getByCategory(
    category: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    const params = new HttpParams()
      .set('category', category)
      .set('page', pagination.pageIndex.toString())
      .set('size', pagination.pageSize.toString());
    return this.http.get<PaginatedResult<Application>>(`${this.entityName}`, { params });
  }

  getByOwner(
    owner: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    const params = new HttpParams()
      .set('owner', owner)
      .set('page', pagination.pageIndex.toString())
      .set('size', pagination.pageSize.toString());
    return this.http.get<PaginatedResult<Application>>(`${this.entityName}`, { params });
  }

  getPublicApplications(pagination: PaginationParams): Observable<PaginatedResult<Application>> {
    const params = new HttpParams()
      .set('isPublic', 'true')
      .set('page', pagination.pageIndex.toString())
      .set('size', pagination.pageSize.toString());
    return this.http.get<PaginatedResult<Application>>(`${this.entityName}`, { params });
  }

  updateStatus(id: number, status: Application['status']): Observable<Application> {
    return this.http.put<Application>(`${this.entityName}/${id}/status`, { status });
  }

  updateVersion(id: number, version: string): Observable<Application> {
    return this.http.put<Application>(`${this.entityName}/${id}/version`, { version });
  }

  addDependency(id: number, dependency: string): Observable<Application> {
    return this.http.post<Application>(`${this.entityName}/${id}/dependencies`, { dependency });
  }

  removeDependency(id: number, dependency: string): Observable<Application> {
    return this.http.delete<Application>(`${this.entityName}/${id}/dependencies/${dependency}`);
  }

  addTag(id: number, tag: string): Observable<Application> {
    return this.http.post<Application>(`${this.entityName}/${id}/tags`, { tag });
  }

  removeTag(id: number, tag: string): Observable<Application> {
    return this.http.delete<Application>(`${this.entityName}/${id}/tags/${tag}`);
  }

  deploy(id: number, environment: Application['environment']): Observable<Application> {
    return this.http.post<Application>(`${this.entityName}/${id}/deploy`, { environment });
  }

  getDeploymentHistory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.entityName}/${id}/deployments`);
  }

  getApplicationStats(): Observable<{
    total: number;
    byStatus: Record<Application['status'], number>;
    byEnvironment: Record<Application['environment'], number>;
    byCategory: Record<string, number>;
  }> {
    return this.http.get<{
      total: number;
      byStatus: Record<Application['status'], number>;
      byEnvironment: Record<Application['environment'], number>;
      byCategory: Record<string, number>;
    }>(`${this.entityName}/stats`);
  }
}
