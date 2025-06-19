import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCustomDialogComponent } from './mat-custom-dialog.component';

describe('MatCustomDialogComponent', () => {
  let component: MatCustomDialogComponent;
  let fixture: ComponentFixture<MatCustomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCustomDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatCustomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
