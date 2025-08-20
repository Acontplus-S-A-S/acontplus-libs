import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateUtilsDemoComponent } from './date-utils-demo.component';

describe('DateUtilsDemoComponent', () => {
  let component: DateUtilsDemoComponent;
  let fixture: ComponentFixture<DateUtilsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateUtilsDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateUtilsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
