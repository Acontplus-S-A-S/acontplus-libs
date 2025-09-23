import { Provider, InjectionToken, Type, APP_INITIALIZER } from '@angular/core';
import { RepositoryFactoryService } from './repository-factory.service';
import { BaseRepository } from '../repositories';
import { BaseEntity } from '@acontplus/core';

export interface RepositoryRegistration {
  key: string;
  type: Type<BaseRepository<BaseEntity>>;
  entityName: string;
  baseUrl: string;
}

export const REPOSITORY_REGISTRATIONS = new InjectionToken<RepositoryRegistration[]>(
  'REPOSITORY_REGISTRATIONS',
);

export function createRepositoryRegistration(
  key: string,
  type: Type<BaseRepository<BaseEntity>>,
  entityName: string,
  baseUrl: string,
): RepositoryRegistration {
  return { key, type, entityName, baseUrl };
}

export function provideRepositoryRegistrations(
  registrations: RepositoryRegistration[],
): Provider[] {
  return [
    { provide: REPOSITORY_REGISTRATIONS, useValue: registrations },
    {
      provide: APP_INITIALIZER,
      useFactory: (factory: RepositoryFactoryService, regs: RepositoryRegistration[] | null) => {
        return () => {
          const items = regs || [];
          items.forEach(r => {
            try {
              // cast type to any to satisfy the generic constraint of createFullRepository
              factory.createFullRepository({
                type: r.type as any,
                entityName: r.entityName,
                baseUrl: r.baseUrl,
                aliasKey: r.key,
              });
            } catch {
              // ignore registration errors during initialization
            }
          });
        };
      },
      deps: [RepositoryFactoryService, REPOSITORY_REGISTRATIONS],
      multi: true,
    },
  ];
}
