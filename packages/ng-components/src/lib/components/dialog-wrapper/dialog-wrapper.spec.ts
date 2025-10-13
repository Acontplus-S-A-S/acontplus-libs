import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWrapper } from './dialog-wrapper';

describe('DialogWrapper', () => {
  let component: DialogWrapper;
  let fixture: ComponentFixture<DialogWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
