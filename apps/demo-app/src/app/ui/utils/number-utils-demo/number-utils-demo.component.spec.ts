import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberUtilsDemoComponent } from './number-utils-demo.component';

describe('NumberUtilsDemoComponent', () => {
  let component: NumberUtilsDemoComponent;
  let fixture: ComponentFixture<NumberUtilsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberUtilsDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberUtilsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
