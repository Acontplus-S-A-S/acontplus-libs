import { TestBed } from '@angular/core/testing';

import { AcontplusMaterialService } from './acontplus-material.service';

describe('AcontplusMaterialService', () => {
  let service: AcontplusMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcontplusMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
