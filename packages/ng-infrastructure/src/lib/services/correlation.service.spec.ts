import { TestBed } from '@angular/core/testing';

import { CorrelationService } from './correlation.service';

describe('CorrelationService', () => {
  let service: CorrelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
