import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIcon } from './svg-icon';

describe('SvgIcon', () => {
  let component: SvgIcon;
  let fixture: ComponentFixture<SvgIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
