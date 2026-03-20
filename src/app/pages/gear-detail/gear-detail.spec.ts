import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearDetailComponent } from './gear-detail';

describe('GearDetail', () => {
  let component: GearDetailComponent;
  let fixture: ComponentFixture<GearDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GearDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GearDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
