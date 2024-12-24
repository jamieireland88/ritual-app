import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RitualListComponent } from './ritual-list.component';

describe('RitualListComponent', () => {
  let component: RitualListComponent;
  let fixture: ComponentFixture<RitualListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RitualListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RitualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
