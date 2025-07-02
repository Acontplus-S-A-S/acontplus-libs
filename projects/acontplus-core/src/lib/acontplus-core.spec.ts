import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcontplusCore } from './acontplus-core';

describe('AcontplusCore', () => {
  let component: AcontplusCore;
  let fixture: ComponentFixture<AcontplusCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcontplusCore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcontplusCore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
