import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDynamicTableComponent } from './mat-dynamic-table.component';

describe('MatDynamicTableComponent', () => {
  let component: MatDynamicTableComponent;
  let fixture: ComponentFixture<MatDynamicTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDynamicTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatDynamicTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
