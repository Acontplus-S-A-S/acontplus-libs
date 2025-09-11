import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from '@acontplus-core';
import { Application, ApplicationFilterParams } from '../domain/application';
import { PaginationParams, PaginatedResult } from '@acontplus-core';
import { MockApplicationService } from './mock-application.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationRepository extends BaseRepository<Application> {
  private mockService = inject(MockApplicationService);

  protected entityName = 'applications';
  protected baseUrl = 'https://api.example.com/v1';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  // Override base methods to use mock service for demonstration
  override getAll(
    pagination: PaginationParams,
    filters?: ApplicationFilterParams,
  ): Observable<PaginatedResult<Application>> {
    return this.mockService.getAll(pagination, filters);
  }

  override getById(id: number): Observable<Application> {
    return this.mockService.getById(id);
  }

  override create(application: Omit<Application, 'id'>): Observable<Application> {
    return this.mockService.create(application);
  }

  override update(id: number, application: Partial<Application>): Observable<Application> {
    return this.mockService.update(id, application);
  }

  override delete(id: number): Observable<boolean> {
    return this.mockService.delete(id);
  }

  override search(
    query: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.mockService.search(query, pagination);
  }

  // Application-specific methods
  getByStatus(
    status: Application['status'],
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.mockService.getByStatus(status, pagination);
  }

  getByEnvironment(
    environment: Application['environment'],
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.mockService.getByEnvironment(environment, pagination);
  }

  getByCategory(
    category: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.mockService.getByCategory(category, pagination);
  }

  getByOwner(
    owner: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Application>> {
    return this.mockService.getByOwner(owner, pagination);
  }

  getPublicApplications(pagination: PaginationParams): Observable<PaginatedResult<Application>> {
    return this.mockService.getPublicApplications(pagination);
  }

  updateStatus(id: number, status: Application['status']): Observable<Application> {
    return this.mockService.updateStatus(id, status);
  }

  updateVersion(id: number, version: string): Observable<Application> {
    return this.mockService.updateVersion(id, version);
  }

  addDependency(id: number, dependency: string): Observable<Application> {
    return this.mockService.addDependency(id, dependency);
  }

  removeDependency(id: number, dependency: string): Observable<Application> {
    return this.mockService.removeDependency(id, dependency);
  }

  addTag(id: number, tag: string): Observable<Application> {
    return this.mockService.addTag(id, tag);
  }

  removeTag(id: number, tag: string): Observable<Application> {
    return this.mockService.removeTag(id, tag);
  }

  deploy(id: number, environment: Application['environment']): Observable<Application> {
    return this.mockService.deploy(id, environment);
  }

  getDeploymentHistory(id: number): Observable<any[]> {
    return this.mockService.getDeploymentHistory(id);
  }

  getApplicationStats(): Observable<{
    total: number;
    byStatus: Record<Application['status'], number>;
    byEnvironment: Record<Application['environment'], number>;
    byCategory: Record<string, number>;
  }> {
    return this.mockService.getApplicationStats();
  }
}
