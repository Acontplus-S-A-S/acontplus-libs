import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcontplusUtilsComponent } from './acontplus-utils.component';

describe('AcontplusUtilsComponent', () => {
  let component: AcontplusUtilsComponent;
  let fixture: ComponentFixture<AcontplusUtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcontplusUtilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcontplusUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
