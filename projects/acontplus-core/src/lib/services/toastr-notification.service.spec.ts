import { TestBed } from '@angular/core/testing';

import { ToastrNotificationService } from './toastr-notification.service';

describe('ToastrNotificationService', () => {
  let service: ToastrNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
