import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearAdd } from './gear-add';

describe('GearAdd', () => {
  let component: GearAdd;
  let fixture: ComponentFixture<GearAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GearAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(GearAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
