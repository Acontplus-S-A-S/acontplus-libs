import { TestBed } from '@angular/core/testing';

import { AdvancedDialogService } from './advanced-dialog.service';

describe('AdvancedDialogService', () => {
  let service: AdvancedDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancedDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
