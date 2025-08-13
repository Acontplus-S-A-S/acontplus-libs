import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayUtilsDemoComponent } from './array-utils-demo.component';

describe('ArrayUtilsDemoComponent', () => {
  let component: ArrayUtilsDemoComponent;
  let fixture: ComponentFixture<ArrayUtilsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrayUtilsDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrayUtilsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
