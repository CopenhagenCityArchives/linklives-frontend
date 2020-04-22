import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { SearchResultListComponent } from './search-result-list.component';

describe('SearchResultListComponent', () => {
  let component: SearchResultListComponent;
  let fixture: ComponentFixture<SearchResultListComponent>;
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
  });
  
  it('should create', () => {
    routeStub.queryParamMap = of(convertToParamMap({query: "jens"}));
    routeStub.paramMap = of(convertToParamMap({start: 0}));
    routeStub.data = of({ searchResult: { 
      totalHits: 1,
      indexHits: { lifeCourses: 0, pas: 1, links: 1},
      hits: [{
        type: "pa",
        pa: { 
          life_course_id: null,
          link_id: null,
          method_id: null,
          pa_id: 1,
          score: 1.0,
          source_id: 1,
          name: "Name",
          sex: "Sex",
          age: 20,
          birthplace: "Birthplace",
          parish: "Parish",
          county: "County",
          district: "District",
          name_clean: "Name_clean",
          age_clean: 20,
          sex_clean: "k",
          name_std: "string",
          firstnames_std: "firstnames",
          surnames_std: "string",
          county_std: "string",
          parish_std: "string",
          district_std: "string"
        }
      }]
    }});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
