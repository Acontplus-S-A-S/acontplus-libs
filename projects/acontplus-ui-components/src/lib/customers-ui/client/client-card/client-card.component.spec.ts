import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCardComponent } from './client-card.component';

describe('ClientCardComponent', () => {
  let component: ClientCardComponent;
  let fixture: ComponentFixture<ClientCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-card/client-card.component.spec.ts
      imports: [ClientCardComponent]
    })
    .compileComponents();
========
      imports: [CustomerCardComponent],
    }).compileComponents();
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-card/customer-card.component.spec.ts

    fixture = TestBed.createComponent(ClientCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
