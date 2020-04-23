import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { SearchService, PersonalAppearance, ElasticSearchResult } from './search.service';
import { environment } from 'src/environments/environment';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#simpleSearch', () => {
    it('should return an error observable, when the underlying http request fails', done => {
      service.simpleSearch("query", ["pas", "lifecourses"], 0, 10).subscribe(_ => {
        done.fail("observable next callback should not be called"); 
      }, error => {
        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(error.statusText).toBe("status text");
        done();
      }, () => {
        done.fail("observable complete callback should not be called");
      });

      let request = httpMock.expectOne(`${environment.apiUrl}/pas,lifecourses/_search`);
      expect(request.request.method).toBe("POST");
      request.error(new ErrorEvent("error event"), {status: 500, statusText: "status text"});
      httpMock.verify();
    });

    it('should return a complete observable, when the underlying http request succeeds', () => {
      const pa : PersonalAppearance = { 
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
      };

      const esResult : ElasticSearchResult = {
        took: 2,
        timed_out: false,
        _shards: {
          total: 1,
          successful: 1,
          skipped: 0,
          failed: 0
        },
        hits: {
          total: {
            value: 1,
            relation: "eq"
          },
          max_score: 1.0,
          hits: [{
            _index: "pas",
            _type: "document",
            _id: 1,
            _score: 1.0,
            _source: {
              personal_appearance: pa
            }
          }]
        },
        aggregations: {
          count: {
            doc_count_error_upper_bound: 0.0,
            sum_other_doc_count: 0,
            buckets: [{
              key: "pas",
              doc_count: 1
            }]
          }
        }
      }

      service.simpleSearch("query", ["pas", "lifecourses"], 0, 10).subscribe((searchResult) => {
        expect(searchResult.totalHits).toBe(1);
        expect(searchResult.indexHits.pas).toBe(1);
        expect(searchResult.took).toBe(2);
        expect(searchResult.hits[0].type).toBe("pas");
        expect(searchResult.hits[0].pa).toBeDefined();
        expect(searchResult.hits[0].pa).toEqual(pa);
      });

      let request = httpMock.expectOne(`${environment.apiUrl}/pas,lifecourses/_search`);
      expect(request.request.method).toBe("POST");
      request.flush(esResult);
      httpMock.verify();
    });
  });
});
