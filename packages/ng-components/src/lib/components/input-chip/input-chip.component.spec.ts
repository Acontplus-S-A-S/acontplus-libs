import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputChipComponent } from './input-chip.component';

describe('InputChipComponent', () => {
  let component: InputChipComponent;
  let fixture: ComponentFixture<InputChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
