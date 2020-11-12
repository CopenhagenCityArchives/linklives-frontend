import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonAppearanceItemComponent } from './person-appearance-item.component';
import { RouterLinkStubDirective } from 'src/testing/router-link-stub.directive';

describe('PersonAppearanceItemComponent', () => {
  let component: PersonAppearanceItemComponent;
  let fixture: ComponentFixture<PersonAppearanceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonAppearanceItemComponent, RouterLinkStubDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAppearanceItemComponent);
    component = fixture.componentInstance;
  });

  xit('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
