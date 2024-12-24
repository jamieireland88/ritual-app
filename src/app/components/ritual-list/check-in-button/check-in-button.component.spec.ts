import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInButtonComponent } from './check-in-button.component';

describe('CheckInButtonComponent', () => {
  let component: CheckInButtonComponent;
  let fixture: ComponentFixture<CheckInButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
