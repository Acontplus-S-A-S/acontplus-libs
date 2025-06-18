import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcontplusUiComponents } from './acontplus-ui-components';

describe('AcontplusUiComponents', () => {
  let component: AcontplusUiComponents;
  let fixture: ComponentFixture<AcontplusUiComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcontplusUiComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcontplusUiComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
