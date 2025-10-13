import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCard } from './dynamic-card';

describe('DynamicCard', () => {
  let component: DynamicCard;
  let fixture: ComponentFixture<DynamicCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
