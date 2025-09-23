import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgCore } from './ng-core';

describe('NgCore', () => {
  let component: NgCore;
  let fixture: ComponentFixture<NgCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgCore],
    }).compileComponents();

    fixture = TestBed.createComponent(NgCore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
