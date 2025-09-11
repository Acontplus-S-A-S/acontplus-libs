import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { CompositeUseCase } from '@acontplus-core';
import { Application, ApplicationFilterParams } from '../domain/application';
import { PaginationParams, PaginatedResult } from '@acontplus-core';
import { ApplicationRepository } from '../data/application.repository';

export interface ApplicationManagementRequest {
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'bulk-operations'
    | 'search'
    | 'get-all'
    | 'get-by-id'
    | 'get-by-status'
    | 'get-by-environment'
    | 'get-by-category'
    | 'get-by-owner'
    | 'get-public'
    | 'update-status'
    | 'update-version'
    | 'add-dependency'
    | 'remove-dependency'
    | 'add-tag'
    | 'remove-tag'
    | 'deploy'
    | 'get-deployment-history'
    | 'get-stats';
  data?: any;
  pagination?: PaginationParams;
  filters?: ApplicationFilterParams;
}

export interface ApplicationManagementResponse {
  success: boolean;
  data?: any;
  message?: string;
  affectedApplications?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationManagementUseCase extends CompositeUseCase<
  ApplicationManagementRequest,
  ApplicationManagementResponse
> {
  private applicationRepository = inject(ApplicationRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  protected executeInternal(
    request: ApplicationManagementRequest,
  ): Observable<ApplicationManagementResponse> {
    switch (request.action) {
      case 'create':
        return this.handleCreate(request.data);
      case 'update':
        return this.handleUpdate(request.data);
      case 'delete':
        return this.handleDelete(request.data);
      case 'bulk-operations':
        return this.handleBulkOperations(request.data);
      case 'search':
        return this.handleSearch(request.data);
      case 'get-all':
        return this.handleGetAll(request.pagination, request.filters);
      case 'get-by-id':
        return this.handleGetById(request.data);
      case 'get-by-status':
        return this.handleGetByStatus(request.data);
      case 'get-by-environment':
        return this.handleGetByEnvironment(request.data);
      case 'get-by-category':
        return this.handleGetByCategory(request.data);
      case 'get-by-owner':
        return this.handleGetByOwner(request.data);
      case 'get-public':
        return this.handleGetPublic(request.pagination);
      case 'update-status':
        return this.handleUpdateStatus(request.data);
      case 'update-version':
        return this.handleUpdateVersion(request.data);
      case 'add-dependency':
        return this.handleAddDependency(request.data);
      case 'remove-dependency':
        return this.handleRemoveDependency(request.data);
      case 'add-tag':
        return this.handleAddTag(request.data);
      case 'remove-tag':
        return this.handleRemoveTag(request.data);
      case 'deploy':
        return this.handleDeploy(request.data);
      case 'get-deployment-history':
        return this.handleGetDeploymentHistory(request.data);
      case 'get-stats':
        return this.handleGetStats();
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }
  }

  private handleCreate(
    applicationData: Omit<Application, 'id'>,
  ): Observable<ApplicationManagementResponse> {
    // Validation
    if (!applicationData.name || !applicationData.description || !applicationData.version) {
      return of({
        success: false,
        message: 'Name, description, and version are required',
        affectedApplications: 0,
      });
    }

    return this.applicationRepository.create(applicationData).pipe(
      map(application => ({
        success: true,
        data: application,
        message: 'Application created successfully',
        affectedApplications: 1,
      })),
    );
  }

  private handleUpdate(updateData: {
    id: number;
    data: Partial<Application>;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.update(updateData.id, updateData.data).pipe(
      map(application => ({
        success: true,
        data: application,
        message: 'Application updated successfully',
        affectedApplications: 1,
      })),
    );
  }

  private handleDelete(deleteData: { id: number }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.delete(deleteData.id).pipe(
      map(success => ({
        success,
        message: success ? 'Application deleted successfully' : 'Failed to delete application',
        affectedApplications: success ? 1 : 0,
      })),
    );
  }

  private handleBulkOperations(bulkData: any): Observable<ApplicationManagementResponse> {
    // This would typically involve multiple repository calls
    // For demo purposes, we'll return a mock response
    return of({
      success: true,
      message: 'Bulk operations completed successfully',
      affectedApplications: bulkData.operations?.length || 0,
    });
  }

  private handleSearch(searchData: {
    query: string;
    pagination: PaginationParams;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.search(searchData.query, searchData.pagination).pipe(
      map(result => ({
        success: true,
        data: result,
        message: `Found ${result.totalCount} applications`,
        affectedApplications: result.totalCount,
      })),
    );
  }

  private handleGetAll(
    pagination?: PaginationParams,
    filters?: ApplicationFilterParams,
  ): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.getAll(pagination || { page: 1, pageSize: 10 }, filters).pipe(
      map(result => ({
        success: true,
        data: result,
        message: `Retrieved ${result.items.length} applications`,
        affectedApplications: result.items.length,
      })),
    );
  }

  private handleGetById(data: { id: number }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.getById(data.id).pipe(
      map(application => ({
        success: true,
        data: application,
        message: 'Application retrieved successfully',
        affectedApplications: 1,
      })),
    );
  }

  private handleGetByStatus(data: {
    status: Application['status'];
    pagination: PaginationParams;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.getByStatus(data.status, data.pagination).pipe(
      map(result => ({
        success: true,
        data: result,
        message: `Retrieved ${result.items.length} applications with status ${data.status}`,
        affectedApplications: result.items.length,
      })),
    );
  }

  private handleGetByEnvironment(data: {
    environment: Application['environment'];
    pagination: PaginationParams;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.getByEnvironment(data.environment, data.pagination).pipe(
      map(result => ({
        success: true,
        data: result,
        message: `Retrieved ${result.items.length} applications in ${data.environment} environment`,
        affectedApplications: result.items.length,
      })),
    );
  }

  private handleGetByCategory(data: {
    category: string;
    pagination: PaginationParams;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.getByCategory(data.category, data.pagination).pipe(
      map(result => ({
        success: true,
        data: result,
        message: `Retrieved ${result.items.length} applications in category ${data.category}`,
        affectedApplications: result.items.length,
      })),
    );
  }

  private handleGetByOwner(data: {
    owner: string;
    pagination: PaginationParams;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.getByOwner(data.owner, data.pagination).pipe(
      map(result => ({
        success: true,
        data: result,
        message: `Retrieved ${result.items.length} applications owned by ${data.owner}`,
        affectedApplications: result.items.length,
      })),
    );
  }

  private handleGetPublic(
    pagination?: PaginationParams,
  ): Observable<ApplicationManagementResponse> {
    return this.applicationRepository
      .getPublicApplications(pagination || { page: 1, pageSize: 10 })
      .pipe(
        map(result => ({
          success: true,
          data: result,
          message: `Retrieved ${result.items.length} public applications`,
          affectedApplications: result.items.length,
        })),
      );
  }

  private handleUpdateStatus(data: {
    id: number;
    status: Application['status'];
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.updateStatus(data.id, data.status).pipe(
      map(application => ({
        success: true,
        data: application,
        message: `Application status updated to ${data.status}`,
        affectedApplications: 1,
      })),
    );
  }

  private handleUpdateVersion(data: {
    id: number;
    version: string;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.updateVersion(data.id, data.version).pipe(
      map(application => ({
        success: true,
        data: application,
        message: `Application version updated to ${data.version}`,
        affectedApplications: 1,
      })),
    );
  }

  private handleAddDependency(data: {
    id: number;
    dependency: string;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.addDependency(data.id, data.dependency).pipe(
      map(application => ({
        success: true,
        data: application,
        message: `Dependency ${data.dependency} added successfully`,
        affectedApplications: 1,
      })),
    );
  }

  private handleRemoveDependency(data: {
    id: number;
    dependency: string;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.removeDependency(data.id, data.dependency).pipe(
      map(application => ({
        success: true,
        data: application,
        message: `Dependency ${data.dependency} removed successfully`,
        affectedApplications: 1,
      })),
    );
  }

  private handleAddTag(data: {
    id: number;
    tag: string;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.addTag(data.id, data.tag).pipe(
      map(application => ({
        success: true,
        data: application,
        message: `Tag ${data.tag} added successfully`,
        affectedApplications: 1,
      })),
    );
  }

  private handleRemoveTag(data: {
    id: number;
    tag: string;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.removeTag(data.id, data.tag).pipe(
      map(application => ({
        success: true,
        data: application,
        message: `Tag ${data.tag} removed successfully`,
        affectedApplications: 1,
      })),
    );
  }

  private handleDeploy(data: {
    id: number;
    environment: Application['environment'];
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.deploy(data.id, data.environment).pipe(
      map(application => ({
        success: true,
        data: application,
        message: `Application deployed to ${data.environment} successfully`,
        affectedApplications: 1,
      })),
    );
  }

  private handleGetDeploymentHistory(data: {
    id: number;
  }): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.getDeploymentHistory(data.id).pipe(
      map(history => ({
        success: true,
        data: history,
        message: `Retrieved deployment history for application ${data.id}`,
        affectedApplications: 1,
      })),
    );
  }

  private handleGetStats(): Observable<ApplicationManagementResponse> {
    return this.applicationRepository.getApplicationStats().pipe(
      map(stats => ({
        success: true,
        data: stats,
        message: 'Application statistics retrieved successfully',
        affectedApplications: stats.total,
      })),
    );
  }

  // Public methods for external use
  public getApplications(
    pagination: PaginationParams,
    filters?: ApplicationFilterParams,
  ): Observable<PaginatedResult<Application>> {
    return this.execute({ action: 'get-all', pagination, filters }).pipe(
      map(response => response.data),
    );
  }

  public getApplicationById(id: number): Observable<Application> {
    return this.execute({ action: 'get-by-id', data: { id } }).pipe(map(response => response.data));
  }

  public createApplication(applicationData: Omit<Application, 'id'>): Observable<Application> {
    return this.execute({ action: 'create', data: applicationData }).pipe(
      map(response => response.data),
    );
  }

  public updateApplication(
    id: number,
    applicationData: Partial<Application>,
  ): Observable<Application> {
    return this.execute({ action: 'update', data: { id, data: applicationData } }).pipe(
      map(response => response.data),
    );
  }

  public deleteApplication(id: number): Observable<boolean> {
    return this.execute({ action: 'delete', data: { id } }).pipe(map(response => response.success));
  }

  public searchApplications(
    query: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.execute({ action: 'search', data: { query, pagination } }).pipe(
      map(response => response.data),
    );
  }

  public getApplicationsByStatus(
    status: Application['status'],
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.execute({ action: 'get-by-status', data: { status, pagination } }).pipe(
      map(response => response.data),
    );
  }

  public getApplicationsByEnvironment(
    environment: Application['environment'],
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.execute({ action: 'get-by-environment', data: { environment, pagination } }).pipe(
      map(response => response.data),
    );
  }

  public getApplicationsByCategory(
    category: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.execute({ action: 'get-by-category', data: { category, pagination } }).pipe(
      map(response => response.data),
    );
  }

  public getApplicationsByOwner(
    owner: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.execute({ action: 'get-by-owner', data: { owner, pagination } }).pipe(
      map(response => response.data),
    );
  }

  public getPublicApplications(
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.execute({ action: 'get-public', pagination }).pipe(map(response => response.data));
  }

  public updateApplicationStatus(
    id: number,
    status: Application['status'],
  ): Observable<Application> {
    return this.execute({ action: 'update-status', data: { id, status } }).pipe(
      map(response => response.data),
    );
  }

  public updateApplicationVersion(id: number, version: string): Observable<Application> {
    return this.execute({ action: 'update-version', data: { id, version } }).pipe(
      map(response => response.data),
    );
  }

  public addApplicationDependency(id: number, dependency: string): Observable<Application> {
    return this.execute({ action: 'add-dependency', data: { id, dependency } }).pipe(
      map(response => response.data),
    );
  }

  public removeApplicationDependency(id: number, dependency: string): Observable<Application> {
    return this.execute({ action: 'remove-dependency', data: { id, dependency } }).pipe(
      map(response => response.data),
    );
  }

  public addApplicationTag(id: number, tag: string): Observable<Application> {
    return this.execute({ action: 'add-tag', data: { id, tag } }).pipe(
      map(response => response.data),
    );
  }

  public removeApplicationTag(id: number, tag: string): Observable<Application> {
    return this.execute({ action: 'remove-tag', data: { id, tag } }).pipe(
      map(response => response.data),
    );
  }

  public deployApplication(
    id: number,
    environment: Application['environment'],
  ): Observable<Application> {
    return this.execute({ action: 'deploy', data: { id, environment } }).pipe(
      map(response => response.data),
    );
  }

  public getApplicationDeploymentHistory(id: number): Observable<any[]> {
    return this.execute({ action: 'get-deployment-history', data: { id } }).pipe(
      map(response => response.data),
    );
  }

  public getApplicationStatistics(): Observable<{
    total: number;
    byStatus: Record<Application['status'], number>;
    byEnvironment: Record<Application['environment'], number>;
    byCategory: Record<string, number>;
  }> {
    return this.execute({ action: 'get-stats' }).pipe(map(response => response.data));
  }
}
