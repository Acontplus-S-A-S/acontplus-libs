import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabulatorComponent } from './custom-tabulator.component';

describe('CustomTabulatorComponent', () => {
  let component: CustomTabulatorComponent;
  let fixture: ComponentFixture<CustomTabulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTabulatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomTabulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
