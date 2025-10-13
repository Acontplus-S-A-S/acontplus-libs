import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulatorTable } from './tabulator-table';

describe('TabulatorTable', () => {
  let component: TabulatorTable;
  let fixture: ComponentFixture<TabulatorTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabulatorTable],
    }).compileComponents();

    fixture = TestBed.createComponent(TabulatorTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
