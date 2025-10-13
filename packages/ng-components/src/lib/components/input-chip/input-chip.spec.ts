import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputChip } from './input-chip';

describe('InputChip', () => {
  let component: InputChip;
  let fixture: ComponentFixture<InputChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputChip],
    }).compileComponents();

    fixture = TestBed.createComponent(InputChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
