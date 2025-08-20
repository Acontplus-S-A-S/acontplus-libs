import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecimaldemoComponent } from './decimaldemo.component';

describe('DecimaldemoComponent', () => {
  let component: DecimaldemoComponent;
  let fixture: ComponentFixture<DecimaldemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecimaldemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecimaldemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
