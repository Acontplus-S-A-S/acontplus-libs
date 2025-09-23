import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcontplusCustomers } from './acontplus-customers';

describe('AcontplusCustomers', () => {
  let component: AcontplusCustomers;
  let fixture: ComponentFixture<AcontplusCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcontplusCustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcontplusCustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
