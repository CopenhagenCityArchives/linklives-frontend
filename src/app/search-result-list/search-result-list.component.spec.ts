import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { of, Observable } from 'rxjs';

import { SearchResultListComponent } from './search-result-list.component';
import { RouterLinkActiveOptionsStubDirective } from 'src/testing/router-link-active-options-stub.directive';
import { QueryParamsStubDirective } from 'src/testing/query-params-stub.directive';
import { RouterLinkStubDirective } from 'src/testing/router-link-stub.directive';
import { SearchResult } from '../search/search.service';
import { LifeCourseItemComponent } from '../life-course/life-course-item.component';
import { PersonAppearanceItemComponent } from '../person-appearance/person-appearance-item.component';

describe('SearchResultListComponent', () => {
  let component: SearchResultListComponent;
  let fixture: ComponentFixture<SearchResultListComponent>;
  let compiled: Element;
  let routeStub: {
    queryParamMap: Observable<ParamMap>,
    paramMap: Observable<ParamMap>, 
    data: Observable<{searchResult: SearchResult}>
  }
  routeStub = { queryParamMap: null, paramMap: null, data: null };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultListComponent, LifeCourseItemComponent, PersonAppearanceItemComponent, RouterLinkStubDirective, QueryParamsStubDirective, RouterLinkActiveOptionsStubDirective ],
      providers: [ { provide: ActivatedRoute, useValue: routeStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultListComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    routeStub.queryParamMap = of(convertToParamMap({query: "search term"}));
    routeStub.paramMap = of(convertToParamMap({start: 0}));
    routeStub.data = of({ searchResult: { 
      took: 1,
      totalHits: 3,
      indexHits: { lifeCourses: 1, pas: 2 },
      hits: [
        {
          type: "pas",
          pa: {
            pa_id: 1,
            source_id: 1,
            løbenr_i_indtastning: 1, 
            Stednavn: 'Stednavn 1', 
            name: 'name 1', 
            age: 1, 
            Erhverv: 'Erhverv 1', 
            Stilling_i_husstanden: 'Stilling_i_husstanden 1', 
            birth_place: 'birth_place 1', 
            gender: 'gender 1', 
            Sogn: 'Sogn 1', 
            Amt: 'Amt 1', 
            Herred: 'Herred 1', 
            gender_clean: 'gender_clean 1', 
            name_clean: 'name_clean 1', 
            age_clean: 1, 
            hh_id: 1, 
            hh_pos_std: 'hh_pos_std 1', 
            is_husband: true, 
            has_husband: false, 
            name_std: 'name_std 1', 
            maiden_family_names: 'maiden_family_names 1', 
            maiden_patronyms: 'maiden_patronyms 1', 
            first_names: 'first_names 1', 
            patronyms: 'patronyms 1', 
            family_names: 'family_names 1', 
            uncat_names: 'uncat_names 1', 
            husband_first_names: 'husband_first_names 1', 
            husband_name_match: false, 
            true_patronym: 'true_patronym 1', 
            all_possible_patronyms: 'all_possible_patronyms 1', 
            all_possible_family_names: 'all_possible_family_names 1', 
            b_place_cl: 'b_place_cl 1', 
            other_cl: 'other_cl 1', 
            parish_cl: 'parish_cl 1', 
            district_cl: 'district_cl 1', 
            county_cl: 'county_cl 1', 
            koebstad_cl: 'koebstad_cl 1', 
            island_cl: 'island_cl 1', 
            town_cl: 'town_cl 1', 
            place_cl: 'place_cl 1', 
            county_std: 'county_std 1', 
            parish_std: 'parish_std 1'
          }
        }, {
        type: "pas",
        pa: {
          pa_id: 2,
          source_id: 2,
          løbenr_i_indtastning: 2, 
          Stednavn: 'Stednavn 2', 
          name: 'name 2', 
          age: 2, 
          Erhverv: 'Erhverv 2', 
          Stilling_i_husstanden: 'Stilling_i_husstanden 2', 
          birth_place: 'birth_place 2', 
          gender: 'gender 2', 
          Sogn: 'Sogn 2', 
          Amt: 'Amt 2', 
          Herred: 'Herred 2', 
          gender_clean: 'gender_clean 2', 
          name_clean: 'name_clean 2', 
          age_clean: 2, 
          hh_id: 2, 
          hh_pos_std: 'hh_pos_std 2', 
          is_husband: true, 
          has_husband: false, 
          name_std: 'name_std 2', 
          maiden_family_names: 'maiden_family_names 2', 
          maiden_patronyms: 'maiden_patronyms 2', 
          first_names: 'first_names 2', 
          patronyms: 'patronyms 2', 
          family_names: 'family_names 2', 
          uncat_names: 'uncat_names 2', 
          husband_first_names: 'husband_first_names 2', 
          husband_name_match: false, 
          true_patronym: 'true_patronym 2', 
          all_possible_patronyms: 'all_possible_patronyms 2', 
          all_possible_family_names: 'all_possible_family_names 2', 
          b_place_cl: 'b_place_cl 2', 
          other_cl: 'other_cl 2', 
          parish_cl: 'parish_cl 2', 
          district_cl: 'district_cl 2', 
          county_cl: 'county_cl 2', 
          koebstad_cl: 'koebstad_cl 2', 
          island_cl: 'island_cl 2', 
          town_cl: 'town_cl 2', 
          place_cl: 'place_cl 2', 
          county_std: 'county_std 2', 
          parish_std: 'parish_std 2'
        }
      }, {
        type: "lifecourses",
        life_course_id: 1,
        pas: [{ 
          pa_id: 1,
          source_id: 1,
          løbenr_i_indtastning: 1, 
          Stednavn: 'Stednavn 1', 
          name: 'name 1', 
          age: 1, 
          Erhverv: 'Erhverv 1', 
          Stilling_i_husstanden: 'Stilling_i_husstanden 1', 
          birth_place: 'birth_place 1', 
          gender: 'gender 1', 
          Sogn: 'Sogn 1', 
          Amt: 'Amt 1', 
          Herred: 'Herred 1', 
          gender_clean: 'gender_clean 1', 
          name_clean: 'name_clean 1', 
          age_clean: 1, 
          hh_id: 1, 
          hh_pos_std: 'hh_pos_std 1', 
          is_husband: true, 
          has_husband: false, 
          name_std: 'name_std 1', 
          maiden_family_names: 'maiden_family_names 1', 
          maiden_patronyms: 'maiden_patronyms 1', 
          first_names: 'first_names 1', 
          patronyms: 'patronyms 1', 
          family_names: 'family_names 1', 
          uncat_names: 'uncat_names 1', 
          husband_first_names: 'husband_first_names 1', 
          husband_name_match: false, 
          true_patronym: 'true_patronym 1', 
          all_possible_patronyms: 'all_possible_patronyms 1', 
          all_possible_family_names: 'all_possible_family_names 1', 
          b_place_cl: 'b_place_cl 1', 
          other_cl: 'other_cl 1', 
          parish_cl: 'parish_cl 1', 
          district_cl: 'district_cl 1', 
          county_cl: 'county_cl 1', 
          koebstad_cl: 'koebstad_cl 1', 
          island_cl: 'island_cl 1', 
          town_cl: 'town_cl 1', 
          place_cl: 'place_cl 1', 
          county_std: 'county_std 1', 
          parish_std: 'parish_std 1'
        }, {
          pa_id: 2,
          source_id: 2,
          løbenr_i_indtastning: 2, 
          Stednavn: 'Stednavn 2', 
          name: 'name 2', 
          age: 2, 
          Erhverv: 'Erhverv 2', 
          Stilling_i_husstanden: 'Stilling_i_husstanden 2', 
          birth_place: 'birth_place 2', 
          gender: 'gender 2', 
          Sogn: 'Sogn 2', 
          Amt: 'Amt 2', 
          Herred: 'Herred 2', 
          gender_clean: 'gender_clean 2', 
          name_clean: 'name_clean 2', 
          age_clean: 2, 
          hh_id: 2, 
          hh_pos_std: 'hh_pos_std 2', 
          is_husband: true, 
          has_husband: false, 
          name_std: 'name_std 2', 
          maiden_family_names: 'maiden_family_names 2', 
          maiden_patronyms: 'maiden_patronyms 2', 
          first_names: 'first_names 2', 
          patronyms: 'patronyms 2', 
          family_names: 'family_names 2', 
          uncat_names: 'uncat_names 2', 
          husband_first_names: 'husband_first_names 2', 
          husband_name_match: false, 
          true_patronym: 'true_patronym 2', 
          all_possible_patronyms: 'all_possible_patronyms 2', 
          all_possible_family_names: 'all_possible_family_names 2', 
          b_place_cl: 'b_place_cl 2', 
          other_cl: 'other_cl 2', 
          parish_cl: 'parish_cl 2', 
          district_cl: 'district_cl 2', 
          county_cl: 'county_cl 2', 
          koebstad_cl: 'koebstad_cl 2', 
          island_cl: 'island_cl 2', 
          town_cl: 'town_cl 2', 
          place_cl: 'place_cl 2', 
          county_std: 'county_std 2', 
          parish_std: 'parish_std 2'
        }]
      }]
    }});
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store search hits', () => {
    expect(component.searchResult.hits.length).toBe(3);
  });

  it('should display query text', () => {
    expect(compiled.querySelector("div > div.row:first-child > div > span > span").textContent).toBe("search term");
  });

  it('should display result count', () => {
    expect(compiled.querySelector("div.p-2:nth-child(1)").textContent).toBe("3 resultater");
  });

  it('should display results', () => {
    let elts = compiled.querySelectorAll(".row");
    expect(elts.length).toBe(9);
    expect(elts[6].querySelector("div.col-md-4:first-child").textContent.trim()).toBe("🕮");
    expect(elts[6].querySelector("div.col-md-4:nth-child(2) > div:first-child").textContent.trim()).toBe("name 1");
    expect(elts[6].querySelector("div.col-md-4:nth-child(2) > div:nth-child(2)").textContent.trim()).toBe("Sogn: Sogn 1");
    expect(elts[6].querySelector("div.col-md-4:nth-child(2) > div:nth-child(3)").textContent.trim()).toBe("Herred: Herred 1");
    expect(elts[6].querySelector("div.col-md-4:nth-child(2) > div:nth-child(4)").textContent.trim()).toBe("Amt: Amt 1");

    expect(elts[7].querySelector("div.col-md-4:first-child").textContent.trim()).toBe("🕮");
    expect(elts[7].querySelector("div.col-md-4:nth-child(2) > div:first-child").textContent.trim()).toBe("name 2");
    expect(elts[7].querySelector("div.col-md-4:nth-child(2) > div:nth-child(2)").textContent.trim()).toBe("Sogn: Sogn 2");
    expect(elts[7].querySelector("div.col-md-4:nth-child(2) > div:nth-child(3)").textContent.trim()).toBe("Herred: Herred 2");
    expect(elts[7].querySelector("div.col-md-4:nth-child(2) > div:nth-child(4)").textContent.trim()).toBe("Amt: Amt 2");

    expect(elts[8].querySelector("div.col-md-4:first-child").textContent.trim()).toBe("🔗 2 kilder");
    expect(elts[8].querySelector("div.col-md-4:nth-child(2) > div:first-child").textContent.trim()).toBe("name_std 1");
    expect(elts[8].querySelector("div.col-md-4:nth-child(2) > div:nth-child(2)").textContent.trim()).toBe("Sogn: parish_std 1");
    expect(elts[8].querySelector("div.col-md-4:nth-child(2) > div:nth-child(3)").textContent.trim()).toBe("Herred: district_cl 1");
    expect(elts[8].querySelector("div.col-md-4:nth-child(2) > div:nth-child(4)").textContent.trim()).toBe("Amt: county_std 1");
  });
});