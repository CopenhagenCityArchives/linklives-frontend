import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PersonAppearance } from '../search/search.service';
import { of } from 'rxjs';

import { PersonAppearanceComponent } from './person-appearance.component';
import { PersonAppearanceItemComponent } from './person-appearance-item.component';

describe('PersonAppearanceComponent', () => {
  let component: PersonAppearanceComponent;
  let fixture: ComponentFixture<PersonAppearanceComponent>;
  let routeStub = { data: undefined };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonAppearanceComponent, PersonAppearanceItemComponent ],
      providers: [ { provide: ActivatedRoute, useValue: routeStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAppearanceComponent);
    component = fixture.componentInstance;
  });

  xit('should create', () => {
    let pa = {};
    routeStub.data = of({item:{pa: pa, hh: [pa]}});
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });
});
