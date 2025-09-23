import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatInputChipComponent } from './mat-input-chip.component';

describe('MatInputChipComponent', () => {
  let component: MatInputChipComponent;
  let fixture: ComponentFixture<MatInputChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
