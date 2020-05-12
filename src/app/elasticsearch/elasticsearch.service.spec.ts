import { TestBed } from '@angular/core/testing';

import { ElasticsearchService, ElasticSearchResult } from './elasticsearch.service';
import { environment } from 'src/environments/environment';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonAppearance } from '../search/search.service';

describe('ElasticsearchService', () => {
  let service: ElasticsearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ElasticsearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchSimple()', () => {
    it('should return an error observable, when the underlying http request fails', done => {
      service.searchSimple("query", ["pas", "lifecourses"], 0, 10).subscribe(_ => {
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
      const pa : PersonAppearance = {
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
              person_appearance: pa
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

      service.searchSimple("query", ["pas", "lifecourses"], 0, 10).subscribe((searchResult) => {
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
