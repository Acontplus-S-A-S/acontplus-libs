import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgCustomer } from './ng-customer';

describe('NgCustomer', () => {
  let component: NgCustomer;
  let fixture: ComponentFixture<NgCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgCustomer],
    }).compileComponents();

    fixture = TestBed.createComponent(NgCustomer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
