import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Application } from '../domain/application';
import { PagedResult, PaginationParams } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class MockApplicationService {
  private applications: Application[] = [
    {
      id: 1,
      name: 'Customer Portal',
      description: 'Web application for customer self-service and account management',
      version: '2.1.0',
      status: 'active',
      category: 'Web Application',
      owner: 'Frontend Team',
      environment: 'production',
      lastDeployed: '2024-01-15T10:00:00Z',
      dependencies: ['Angular 20', 'Material Design', 'RxJS'],
      tags: ['customer-facing', 'portal', 'web'],
      isPublic: true,
      repositoryUrl: 'https://github.com/company/customer-portal',
      documentationUrl: 'https://docs.company.com/customer-portal',
      createdAt: '2023-06-01T09:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      name: 'Order Management API',
      description: 'RESTful API for managing customer orders and inventory',
      version: '1.5.2',
      status: 'active',
      category: 'API',
      owner: 'Backend Team',
      environment: 'production',
      lastDeployed: '2024-01-10T14:30:00Z',
      dependencies: ['Node.js', 'Express', 'MongoDB'],
      tags: ['api', 'orders', 'inventory'],
      isPublic: false,
      repositoryUrl: 'https://github.com/company/order-api',
      documentationUrl: 'https://api.company.com/docs',
      createdAt: '2023-03-15T11:00:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
    },
    {
      id: 3,
      name: 'Mobile App',
      description: 'Cross-platform mobile application for iOS and Android',
      version: '3.0.1',
      status: 'maintenance',
      category: 'Mobile Application',
      owner: 'Mobile Team',
      environment: 'staging',
      lastDeployed: '2024-01-12T16:45:00Z',
      dependencies: ['React Native', 'Redux', 'Native Base'],
      tags: ['mobile', 'cross-platform', 'react-native'],
      isPublic: true,
      repositoryUrl: 'https://github.com/company/mobile-app',
      documentationUrl: 'https://docs.company.com/mobile',
      createdAt: '2023-01-20T08:00:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
    },
    {
      id: 4,
      name: 'Analytics Dashboard',
      description: 'Real-time analytics and reporting dashboard for business intelligence',
      version: '1.2.0',
      status: 'active',
      category: 'Dashboard',
      owner: 'Data Team',
      environment: 'production',
      lastDeployed: '2024-01-08T12:15:00Z',
      dependencies: ['Vue.js', 'D3.js', 'Chart.js'],
      tags: ['analytics', 'dashboard', 'business-intelligence'],
      isPublic: false,
      repositoryUrl: 'https://github.com/company/analytics-dashboard',
      documentationUrl: 'https://docs.company.com/analytics',
      createdAt: '2023-08-10T13:00:00Z',
      updatedAt: '2024-01-08T12:15:00Z',
    },
    {
      id: 5,
      name: 'Legacy System',
      description: 'Legacy enterprise system for internal operations',
      version: '5.2.1',
      status: 'deprecated',
      category: 'Enterprise',
      owner: 'Legacy Team',
      environment: 'production',
      lastDeployed: '2023-12-01T09:00:00Z',
      dependencies: ['Java 8', 'Spring Framework', 'Oracle DB'],
      tags: ['legacy', 'enterprise', 'internal'],
      isPublic: false,
      repositoryUrl: 'https://github.com/company/legacy-system',
      documentationUrl: 'https://docs.company.com/legacy',
      createdAt: '2018-05-15T10:00:00Z',
      updatedAt: '2023-12-01T09:00:00Z',
    },
    {
      id: 6,
      name: 'DevOps Tools',
      description: 'Collection of DevOps tools and automation scripts',
      version: '2.0.0',
      status: 'active',
      category: 'DevOps',
      owner: 'DevOps Team',
      environment: 'development',
      lastDeployed: '2024-01-14T11:20:00Z',
      dependencies: ['Python', 'Docker', 'Kubernetes'],
      tags: ['devops', 'automation', 'tools'],
      isPublic: true,
      repositoryUrl: 'https://github.com/company/devops-tools',
      documentationUrl: 'https://docs.company.com/devops',
      createdAt: '2023-09-01T14:00:00Z',
      updatedAt: '2024-01-14T11:20:00Z',
    },
    {
      id: 7,
      name: 'Testing Framework',
      description: 'Comprehensive testing framework for automated testing',
      version: '1.8.3',
      status: 'active',
      category: 'Testing',
      owner: 'QA Team',
      environment: 'staging',
      lastDeployed: '2024-01-11T15:30:00Z',
      dependencies: ['Jest', 'Cypress', 'Playwright'],
      tags: ['testing', 'automation', 'qa'],
      isPublic: false,
      repositoryUrl: 'https://github.com/company/testing-framework',
      documentationUrl: 'https://docs.company.com/testing',
      createdAt: '2023-04-20T16:00:00Z',
      updatedAt: '2024-01-11T15:30:00Z',
    },
    {
      id: 8,
      name: 'Microservice Gateway',
      description: 'API gateway for managing microservices communication',
      version: '1.3.0',
      status: 'maintenance',
      category: 'Infrastructure',
      owner: 'Platform Team',
      environment: 'production',
      lastDeployed: '2024-01-09T13:45:00Z',
      dependencies: ['Kong', 'Redis', 'PostgreSQL'],
      tags: ['gateway', 'microservices', 'infrastructure'],
      isPublic: false,
      repositoryUrl: 'https://github.com/company/api-gateway',
      documentationUrl: 'https://docs.company.com/gateway',
      createdAt: '2023-07-01T12:00:00Z',
      updatedAt: '2024-01-09T13:45:00Z',
    },
  ];

  private nextId = 9;

  // Simulate HTTP delay
  private simulateDelay<T>(data: T): Observable<T> {
    return of(data).pipe(delay(Math.random() * 500 + 200));
  }

  // CRUD operations
  getAll(pagination: PaginationParams): Observable<PagedResult<Application>> {
    const filteredApps = [...this.applications];

    // Apply sorting
    if (pagination.sortBy) {
      filteredApps.sort((a, b) => {
        const aValue = (a as any)[pagination.sortBy!];
        const bValue = (b as any)[pagination.sortBy!];

        if (typeof aValue === 'string') {
          return pagination.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return pagination.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    // Apply pagination
    const page = pagination.pageIndex || 1;
    const pageSize = pagination.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedApps = filteredApps.slice(startIndex, endIndex);

    const result: PagedResult<Application> = {
      hasNextPage: false,
      hasPreviousPage: false,
      items: paginatedApps,
      totalCount: filteredApps.length,
      pageIndex: page,
      pageSize: pageSize,
      totalPages: Math.ceil(filteredApps.length / pageSize),
    };

    return this.simulateDelay(result);
  }

  getById(id: number): Observable<Application> {
    const app = this.applications.find(a => a.id === id);
    if (!app) {
      throw new Error('Application not found');
    }
    return this.simulateDelay(app);
  }

  create(application: Omit<Application, 'id'>): Observable<Application> {
    const newApp: Application = {
      ...application,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.applications.push(newApp);
    return this.simulateDelay(newApp);
  }

  update(id: number, application: Partial<Application>): Observable<Application> {
    const index = this.applications.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Application not found');
    }

    this.applications[index] = {
      ...this.applications[index],
      ...application,
      updatedAt: new Date().toISOString(),
    };

    return this.simulateDelay(this.applications[index]);
  }

  delete(id: number): Observable<boolean> {
    const index = this.applications.findIndex(a => a.id === id);
    if (index === -1) {
      return this.simulateDelay(false);
    }

    this.applications.splice(index, 1);
    return this.simulateDelay(true);
  }

  search(query: string, pagination: PaginationParams): Observable<PagedResult<Application>> {
    return this.getAll(pagination);
  }

  // Application-specific methods
  getByStatus(
    status: Application['status'],
    pagination: PaginationParams,
  ): Observable<PagedResult<Application>> {
    return this.getAll(pagination);
  }

  getByEnvironment(
    environment: Application['environment'],
    pagination: PaginationParams,
  ): Observable<PagedResult<Application>> {
    return this.getAll(pagination);
  }

  getByCategory(
    category: string,
    pagination: PaginationParams,
  ): Observable<PagedResult<Application>> {
    return this.getAll(pagination);
  }

  getByOwner(owner: string, _pagination: PaginationParams): Observable<PagedResult<Application>> {
    const filteredApps = this.applications.filter(app => app.owner === owner);
    const result: PagedResult<Application> = {
      pageIndex: 0,
      items: filteredApps,
      totalCount: filteredApps.length,
      totalPages: 1,
      pageSize: filteredApps.length,
      hasNextPage: false,
      hasPreviousPage: false,
    };
    return this.simulateDelay(result);
  }

  getPublicApplications(pagination: PaginationParams): Observable<PagedResult<Application>> {
    return this.getAll(pagination);
  }

  updateStatus(id: number, status: Application['status']): Observable<Application> {
    return this.update(id, { status });
  }

  updateVersion(id: number, version: string): Observable<Application> {
    return this.update(id, { version });
  }

  addDependency(id: number, dependency: string): Observable<Application> {
    const app = this.applications.find(a => a.id === id);
    if (!app) {
      throw new Error('Application not found');
    }

    if (!app.dependencies.includes(dependency)) {
      app.dependencies.push(dependency);
      app.updatedAt = new Date().toISOString();
    }

    return this.simulateDelay(app);
  }

  removeDependency(id: number, dependency: string): Observable<Application> {
    const app = this.applications.find(a => a.id === id);
    if (!app) {
      throw new Error('Application not found');
    }

    app.dependencies = app.dependencies.filter(d => d !== dependency);
    app.updatedAt = new Date().toISOString();

    return this.simulateDelay(app);
  }

  addTag(id: number, tag: string): Observable<Application> {
    const app = this.applications.find(a => a.id === id);
    if (!app) {
      throw new Error('Application not found');
    }

    if (!app.tags.includes(tag)) {
      app.tags.push(tag);
      app.updatedAt = new Date().toISOString();
    }

    return this.simulateDelay(app);
  }

  removeTag(id: number, tag: string): Observable<Application> {
    const app = this.applications.find(a => a.id === id);
    if (!app) {
      throw new Error('Application not found');
    }

    app.tags = app.tags.filter(t => t !== tag);
    app.updatedAt = new Date().toISOString();

    return this.simulateDelay(app);
  }

  deploy(id: number, environment: Application['environment']): Observable<Application> {
    const app = this.applications.find(a => a.id === id);
    if (!app) {
      throw new Error('Application not found');
    }

    app.environment = environment;
    app.lastDeployed = new Date().toISOString();
    app.updatedAt = new Date().toISOString();

    return this.simulateDelay(app);
  }

  getDeploymentHistory(_id: number): Observable<any[]> {
    // Mock deployment history
    const history = [
      {
        id: 1,
        environment: 'staging',
        version: '1.0.0',
        deployedAt: '2024-01-10T10:00:00Z',
        status: 'success',
      },
      {
        id: 2,
        environment: 'production',
        version: '1.0.0',
        deployedAt: '2024-01-12T14:00:00Z',
        status: 'success',
      },
    ];
    return this.simulateDelay(history);
  }

  getApplicationStats(): Observable<{
    total: number;
    byStatus: Record<Application['status'], number>;
    byEnvironment: Record<Application['environment'], number>;
    byCategory: Record<string, number>;
  }> {
    const total = this.applications.length;
    const byStatus = this.applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<Application['status'], number>,
    );

    const byEnvironment = this.applications.reduce(
      (acc, app) => {
        acc[app.environment] = (acc[app.environment] || 0) + 1;
        return acc;
      },
      {} as Record<Application['environment'], number>,
    );

    const byCategory = this.applications.reduce(
      (acc, app) => {
        acc[app.category] = (acc[app.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return this.simulateDelay({ total, byStatus, byEnvironment, byCategory });
  }
}
