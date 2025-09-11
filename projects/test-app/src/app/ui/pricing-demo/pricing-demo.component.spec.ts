import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingDemoComponent } from './pricing-demo.component';

describe('PricingDemoComponent', () => {
  let component: PricingDemoComponent;
  let fixture: ComponentFixture<PricingDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PricingDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
