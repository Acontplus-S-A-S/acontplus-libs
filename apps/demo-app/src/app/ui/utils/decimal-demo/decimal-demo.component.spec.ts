import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecimalDemoComponent } from './decimal-demo.component';

describe('DecimalDemoComponent', () => {
  let component: DecimalDemoComponent;
  let fixture: ComponentFixture<DecimalDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecimalDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DecimalDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
