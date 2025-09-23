import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatThemeButtonComponent } from './mat-theme-button.component';

describe('MatThemeButtonComponent', () => {
  let component: MatThemeButtonComponent;
  let fixture: ComponentFixture<MatThemeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatThemeButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatThemeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
