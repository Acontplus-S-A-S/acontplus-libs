import { Injectable, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepository, ReadOnlyRepository, WriteOnlyRepository } from '../repositories';
import { BaseEntity } from '../models';
import { Observable } from 'rxjs';

export interface RepositoryConfig<T extends BaseRepository<any>> {
  type: Type<T>;
  entityName: string;
  baseUrl: string;
  options?: {
    enableCaching?: boolean;
    enableAuditing?: boolean;
    customInterceptors?: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class RepositoryFactoryService {
  private repositories = new Map<string, BaseRepository<any>>();

  constructor(private http: HttpClient) {}

  /**
   * Create a full CRUD repository
   */
  createFullRepository<T extends BaseRepository<any>>(
    config: RepositoryConfig<T>
  ): T {
    const key = `${config.type.name}_${config.entityName}`;

    if (this.repositories.has(key)) {
      return this.repositories.get(key) as T;
    }

    const repository = new config.type();
    // Set required properties
    (repository as any).entityName = config.entityName;
    (repository as any).baseUrl = config.baseUrl;
    (repository as any).http = this.http;

    this.repositories.set(key, repository);
    return repository;
  }

  /**
   * Create a read-only repository
   */
  createReadOnlyRepository<T extends BaseEntity>(
    entityName: string,
    baseUrl: string
  ): ReadOnlyRepository<T> {
    const key = `ReadOnly_${entityName}`;

    if (this.repositories.has(key)) {
      return this.repositories.get(key) as ReadOnlyRepository<T>;
    }

    const repository = new (class extends ReadOnlyRepository<T> {
      protected entityName = entityName;
      protected baseUrl = baseUrl;

      override getAll(pagination: any, filters?: any): Observable<any> {
        throw new Error('Method not implemented.');
      }

      override getById(id: number): Observable<T> {
        throw new Error('Method not implemented.');
      }

      override search(query: string, pagination: any): Observable<any> {
        throw new Error('Method not implemented.');
      }
    })();

    (repository as any).http = this.http;
    this.repositories.set(key, repository);
    return repository;
  }

  /**
   * Create a write-only repository
   */
  createWriteOnlyRepository<T extends BaseEntity>(
    entityName: string,
    baseUrl: string
  ): WriteOnlyRepository<T> {
    const key = `WriteOnly_${entityName}`;

    if (this.repositories.has(key)) {
      return this.repositories.get(key) as WriteOnlyRepository<T>;
    }

    const repository = new (class extends WriteOnlyRepository<T> {
      protected entityName = entityName;
      protected baseUrl = baseUrl;

      override create(entity: Omit<T, 'id'>): Observable<T> {
        throw new Error('Method not implemented.');
      }

      override update(id: number, entity: Partial<T>): Observable<T> {
        throw new Error('Method not implemented.');
      }

      override delete(id: number): Observable<boolean> {
        throw new Error('Method not implemented.');
      }
    })();

    (repository as any).http = this.http;
    this.repositories.set(key, repository);
    return repository;
  }

  /**
   * Create a custom repository with specific operations
   */
  createCustomRepository<T extends BaseEntity>(
    entityName: string,
    baseUrl: string,
    operations: Partial<BaseRepository<T>>
  ): BaseRepository<T> {
    const key = `Custom_${entityName}`;

    if (this.repositories.has(key)) {
      return this.repositories.get(key) as BaseRepository<T>;
    }

    const repository = new (class extends BaseRepository<T> {
      protected entityName = entityName;
      protected baseUrl = baseUrl;
    })();

    // Override with custom operations
    Object.assign(repository, operations);
    (repository as any).http = this.http;

    this.repositories.set(key, repository);
    return repository;
  }

  /**
   * Get an existing repository by key
   */
  getRepository<T extends BaseRepository<any>>(key: string): T | undefined {
    return this.repositories.get(key) as T;
  }

  /**
   * Clear all repositories (useful for testing)
   */
  clearRepositories(): void {
    this.repositories.clear();
  }
}
