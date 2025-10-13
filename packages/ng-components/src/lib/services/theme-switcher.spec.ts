import { TestBed } from '@angular/core/testing';

import { ThemeSwitcher } from './theme-switcher';

describe('ThemeSwitcher', () => {
  let service: ThemeSwitcher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeSwitcher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
