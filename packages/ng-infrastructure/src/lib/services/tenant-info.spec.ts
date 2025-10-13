import { TestBed } from '@angular/core/testing';

import { TenantInfo } from './tenant-info';

describe('TenantInfo', () => {
  let service: TenantInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
