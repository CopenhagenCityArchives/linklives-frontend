import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAppearanceComponent } from './personal-appearance.component';

describe('PersonalAppearanceComponent', () => {
  let component: PersonalAppearanceComponent;
  let fixture: ComponentFixture<PersonalAppearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalAppearanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
