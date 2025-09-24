import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDynamicCardComponent } from './mat-dynamic-card.component';

describe('MatDynamicCardComponent', () => {
  let component: MatDynamicCardComponent;
  let fixture: ComponentFixture<MatDynamicCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDynamicCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatDynamicCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
