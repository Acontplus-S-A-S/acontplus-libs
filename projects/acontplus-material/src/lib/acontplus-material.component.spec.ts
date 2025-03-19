import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcontplusMaterialComponent } from './acontplus-material.component';

describe('AcontplusMaterialComponent', () => {
  let component: AcontplusMaterialComponent;
  let fixture: ComponentFixture<AcontplusMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcontplusMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcontplusMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
