import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearEditComponent } from './gear-edit';

describe('GearEdit', () => {
  let component: GearEditComponent;
  let fixture: ComponentFixture<GearEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GearEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GearEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
