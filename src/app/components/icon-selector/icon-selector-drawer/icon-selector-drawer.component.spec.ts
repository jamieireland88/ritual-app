import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSelectorDrawerComponent } from './icon-selector-drawer.component';

describe('IconSelectorDrawerComponent', () => {
  let component: IconSelectorDrawerComponent;
  let fixture: ComponentFixture<IconSelectorDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSelectorDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconSelectorDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
