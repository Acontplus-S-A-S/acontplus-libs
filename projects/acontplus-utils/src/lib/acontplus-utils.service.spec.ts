import { TestBed } from '@angular/core/testing';

import { AcontplusUtilsService } from './acontplus-utils.service';

describe('AcontplusUtilsService', () => {
  let service: AcontplusUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcontplusUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
