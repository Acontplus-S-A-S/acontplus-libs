import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgComponents } from './ng-components';

describe('NgComponents', () => {
  let component: NgComponents;
  let fixture: ComponentFixture<NgComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(NgComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
