import { TestBed } from '@angular/core/testing';

import { CorrelationInfo } from './correlation-info';

describe('CorrelationInfo', () => {
  let service: CorrelationInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrelationInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
