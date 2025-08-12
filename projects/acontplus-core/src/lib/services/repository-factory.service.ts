import { Injectable, Type, InjectionToken, inject, Optional } from '@angular/core';
import { BaseRepository } from '../repositories/base.repository';
import { BaseEntity } from '../models';

// Interface for repository registration
export interface RepositoryRegistration<T extends BaseEntity> {
  key: string;
  repository: Type<BaseRepository<T>>;
  entityName: string;
  baseUrl?: string;
}

// Injection token for repository registrations
export const REPOSITORY_REGISTRATIONS = new InjectionToken<RepositoryRegistration<any>[]>(
  'REPOSITORY_REGISTRATIONS',
  {
    factory: () => [],
  }
);

@Injectable({
  providedIn: 'root'
})
export class RepositoryFactory {
  private repositories = new Map<string, BaseRepository<any>>();
  private registrations = inject(REPOSITORY_REGISTRATIONS, { optional: true }) || [];

  /**
   * Register a repository with the factory
   */
  register<T extends BaseEntity>(
    key: string,
    repository: Type<BaseRepository<T>>,
    entityName: string,
    baseUrl?: string
  ): void {
    // Check if already registered
    if (this.repositories.has(key)) {
      console.warn(`Repository with key '${key}' is already registered. Overwriting...`);
    }

    // Create and store the repository instance
    const repositoryInstance = new repository();

    // Set entity name and base URL if provided
    if (entityName) {
      (repositoryInstance as any).entityName = entityName;
    }
    if (baseUrl) {
      (repositoryInstance as any).baseUrl = baseUrl;
    }

    this.repositories.set(key, repositoryInstance);
  }

  /**
   * Get a repository by key
   */
  get<T extends BaseEntity>(key: string): BaseRepository<T> | undefined {
    return this.repositories.get(key);
  }

  /**
   * Get a repository by key, throwing an error if not found
   */
  getRequired<T extends BaseEntity>(key: string): BaseRepository<T> {
    const repository = this.get<T>(key);
    if (!repository) {
      throw new Error(`Repository with key '${key}' not found. Make sure it's registered.`);
    }
    return repository;
  }

  /**
   * Check if a repository is registered
   */
  has(key: string): boolean {
    return this.repositories.has(key);
  }

  /**
   * Get all registered repository keys
   */
  getRegisteredKeys(): string[] {
    return Array.from(this.repositories.keys());
  }

  /**
   * Get all registered repositories
   */
  getAllRepositories(): Map<string, BaseRepository<any>> {
    return new Map(this.repositories);
  }

  /**
   * Unregister a repository
   */
  unregister(key: string): boolean {
    return this.repositories.delete(key);
  }

  /**
   * Clear all repositories
   */
  clear(): void {
    this.repositories.clear();
  }

  /**
   * Get repository count
   */
  getCount(): number {
    return this.repositories.size;
  }

  /**
   * Initialize repositories from registrations
   */
  initializeFromRegistrations(): void {
    this.registrations.forEach(registration => {
      this.register(
        registration.key,
        registration.repository,
        registration.entityName,
        registration.baseUrl
      );
    });
  }

  /**
   * Get repository by entity type
   */
  getByEntityType<T extends BaseEntity>(entityType: new () => T): BaseRepository<T> | undefined {
    const entityName = new entityType().constructor.name;

    for (const [key, repository] of this.repositories) {
      if ((repository as any).entityName === entityName) {
        return repository as BaseRepository<T>;
      }
    }

    return undefined;
  }

  /**
   * Get repository by entity name
   */
  getByEntityName<T extends BaseEntity>(entityName: string): BaseRepository<T> | undefined {
    for (const [key, repository] of this.repositories) {
      if ((repository as any).entityName === entityName) {
        return repository as BaseRepository<T>;
      }
    }

    return undefined;
  }
}

// Provider function for easy setup
export function provideRepositoryRegistrations(registrations: RepositoryRegistration<any>[]) {
  return [
    {
      provide: REPOSITORY_REGISTRATIONS,
      useValue: registrations,
    },
  ];
}

// Helper function to create repository registration
export function createRepositoryRegistration<T extends BaseEntity>(
  key: string,
  repository: Type<BaseRepository<T>>,
  entityName: string,
  baseUrl?: string
): RepositoryRegistration<T> {
  return {
    key,
    repository,
    entityName,
    baseUrl,
  };
}
