import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonAppearanceItemComponent } from './person-appearance-item.component';

describe('PersonAppearanceItemComponent', () => {
  let component: PersonAppearanceItemComponent;
  let fixture: ComponentFixture<PersonAppearanceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonAppearanceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAppearanceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
