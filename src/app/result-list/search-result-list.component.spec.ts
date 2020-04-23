import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { SearchResultListComponent } from './search-result-list.component';

describe('SearchResultListComponent', () => {
  let component: SearchResultListComponent;
  let fixture: ComponentFixture<SearchResultListComponent>;
  let compiled: Element;
  let routeStub = { queryParamMap: null, paramMap: null, data: null };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultListComponent ],
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
      totalHits: 3,
      indexHits: { lifeCourses: 1, pas: 2 },
      hits: [
        {
          type: "pas",
          pa: { 
            life_course_id: 1,
            link_id: 1,
            method_id: null,
            pa_id: 1,
            score: 1.0,
            source_id: 1,
            name: "name 1",
            sex: "sex 1",
            age: 1,
            birthplace: "birthplace 1",
            parish: "parish 1",
            county: "county 1",
            district: "district 1",
            name_clean: "name_clean 1",
            age_clean: 1,
            sex_clean: "sex_clean 1",
            name_std: "name_std 1",
            firstnames_std: "firstnames_std 1",
            surnames_std: "surnames_std 1",
            county_std: "county_std 1",
            parish_std: "parish_std 1",
            district_std: "district_std 1"
          }
        }, {
        type: "pas",
        pa: { 
          life_course_id: 2,
          link_id: 2,
          method_id: null,
          pa_id: 2,
          score: 2.0,
          source_id: 2,
          name: "name 2",
          sex: "sex 2",
          age: 2,
          birthplace: "birthplace 2",
          parish: "parish 2",
          county: "county 2",
          district: "district 2",
          name_clean: "name_clean 2",
          age_clean: 2,
          sex_clean: "sex_clean 2",
          name_std: "name_std 2",
          firstnames_std: "firstnames_std 2",
          surnames_std: "surnames_std 2",
          county_std: "county_std 2",
          parish_std: "parish_std 2",
          district_std: "district_std 2"
        }
      }, {
        type: "lifecourses",
        pas: [{ 
          life_course_id: 1,
          link_id: 1,
          method_id: null,
          pa_id: 1,
          score: 1.0,
          source_id: 1,
          name: "name 1",
          sex: "sex 1",
          age: 1,
          birthplace: "birthplace 1",
          parish: "parish 1",
          county: "county 1",
          district: "district 1",
          name_clean: "name_clean 1",
          age_clean: 1,
          sex_clean: "sex_clean 1",
          name_std: "name_std 1",
          firstnames_std: "firstnames_std 1",
          surnames_std: "surnames_std 1",
          county_std: "county_std 1",
          parish_std: "parish_std 1",
          district_std: "district_std 1"
        }, { 
          life_course_id: 2,
          link_id: 2,
          method_id: null,
          pa_id: 2,
          score: 2.0,
          source_id: 2,
          name: "name 2",
          sex: "sex 2",
          age: 2,
          birthplace: "birthplace 2",
          parish: "parish 2",
          county: "county 2",
          district: "district 2",
          name_clean: "name_clean 2",
          age_clean: 2,
          sex_clean: "sex_clean 2",
          name_std: "name_std 2",
          firstnames_std: "firstnames_std 2",
          surnames_std: "surnames_std 2",
          county_std: "county_std 2",
          parish_std: "parish_std 2",
          district_std: "district_std 2"
        }]
      }]
    }});
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display query text', () => {
    expect(compiled.querySelector("div > div.row:first-child > div > span > span").textContent).toBe("search term");
  });

  it('should display result count', () => {
    expect(compiled.querySelector("div.p-2:nth-child(1)").textContent).toBe("3 resultater");
  });

  it('should display results', () => {
    let elts = compiled.querySelectorAll("div.row");
    expect(elts.length).toBe(8);
    expect(elts[5].querySelector("div.col-md-4:first-child").textContent.trim()).toBe("🕮");
    expect(elts[5].querySelector("div.col-md-4:nth-child(2) > div:first-child").textContent.trim()).toBe("name 1");
    expect(elts[5].querySelector("div.col-md-4:nth-child(2) > div:nth-child(2)").textContent.trim()).toBe("Sogn: parish 1");
    expect(elts[5].querySelector("div.col-md-4:nth-child(2) > div:nth-child(3)").textContent.trim()).toBe("Herred: district 1");
    expect(elts[5].querySelector("div.col-md-4:nth-child(2) > div:nth-child(4)").textContent.trim()).toBe("Amt: county 1");

    expect(elts[6].querySelector("div.col-md-4:first-child").textContent.trim()).toBe("🕮");
    expect(elts[6].querySelector("div.col-md-4:nth-child(2) > div:first-child").textContent.trim()).toBe("name 2");
    expect(elts[6].querySelector("div.col-md-4:nth-child(2) > div:nth-child(2)").textContent.trim()).toBe("Sogn: parish 2");
    expect(elts[6].querySelector("div.col-md-4:nth-child(2) > div:nth-child(3)").textContent.trim()).toBe("Herred: district 2");
    expect(elts[6].querySelector("div.col-md-4:nth-child(2) > div:nth-child(4)").textContent.trim()).toBe("Amt: county 2");

    expect(elts[7].querySelector("div.col-md-4:first-child").textContent.trim()).toBe("🔗 2 kilder");
    expect(elts[7].querySelector("div.col-md-4:nth-child(2) > div:first-child").textContent.trim()).toBe("name_std 1");
    expect(elts[7].querySelector("div.col-md-4:nth-child(2) > div:nth-child(2)").textContent.trim()).toBe("Sogn: parish_std 1");
    expect(elts[7].querySelector("div.col-md-4:nth-child(2) > div:nth-child(3)").textContent.trim()).toBe("Herred: district_std 1");
    expect(elts[7].querySelector("div.col-md-4:nth-child(2) > div:nth-child(4)").textContent.trim()).toBe("Amt: county_std 1");
  });
});