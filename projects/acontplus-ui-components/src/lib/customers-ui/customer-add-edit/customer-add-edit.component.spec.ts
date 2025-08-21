import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddEditComponent } from './customer-add-edit.component';

describe('CustomerAddEditComponent', () => {
  let component: CustomerAddEditComponent;
  let fixture: ComponentFixture<CustomerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
