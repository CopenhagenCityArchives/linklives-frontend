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

  it('should create', () => {
    let pa: PersonAppearance = {
      pa_id: 1,
      source_id: 1,
      løbenr_i_indtastning: 1, 
      Stednavn: 'Stednavn', 
      name: 'name', 
      age: 1, 
      Erhverv: 'Erhverv', 
      Stilling_i_husstanden: 'Stilling_i_husstanden', 
      birth_place: 'birth_place', 
      gender: 'gender', 
      Sogn: 'Sogn', 
      Amt: 'Amt', 
      Herred: 'Herred', 
      gender_clean: 'gender_clean', 
      name_clean: 'name_clean', 
      age_clean: 1, 
      hh_id: 1, 
      hh_pos_std: 'hh_pos_std', 
      is_husband: true, 
      has_husband: false, 
      name_std: 'name_std', 
      maiden_family_names: 'maiden_family_names', 
      maiden_patronyms: 'maiden_patronyms', 
      first_names: 'first_names', 
      patronyms: 'patronyms', 
      family_names: 'family_names', 
      uncat_names: 'uncat_names', 
      husband_first_names: 'husband_first_names', 
      husband_name_match: false, 
      true_patronym: 'true_patronym', 
      all_possible_patronyms: 'all_possible_patronyms', 
      all_possible_family_names: 'all_possible_family_names', 
      b_place_cl: 'b_place_cl', 
      other_cl: 'other_cl', 
      parish_cl: 'parish_cl', 
      district_cl: 'district_cl', 
      county_cl: 'county_cl', 
      koebstad_cl: 'koebstad_cl', 
      island_cl: 'island_cl', 
      town_cl: 'town_cl', 
      place_cl: 'place_cl', 
      county_std: 'county_std', 
      parish_std: 'parish_std', 
    };
    routeStub.data = of({item:{pa: pa, hh: [pa]}});
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });
});
