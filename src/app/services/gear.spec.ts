import { TestBed } from '@angular/core/testing';

import { Gear } from './gear';

describe('Gear', () => {
  let service: Gear;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gear);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
