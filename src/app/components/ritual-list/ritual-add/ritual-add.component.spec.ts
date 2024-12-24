import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RitualAddComponent } from './ritual-add.component';

describe('RitualAddComponent', () => {
  let component: RitualAddComponent;
  let fixture: ComponentFixture<RitualAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitualAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RitualAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
