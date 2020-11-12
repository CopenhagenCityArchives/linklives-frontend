import { TestBed } from '@angular/core/testing';

import { ElasticsearchService, ElasticSearchResult } from './elasticsearch.service';
import { environment } from 'src/environments/environment';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonAppearance, PersonAppearanceHit } from '../search/search.service';

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

    /*xit('should return a complete observable, when the underlying http request succeeds', () => {
      const pa = {};

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
              person_appearance: {}
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
        expect((searchResult.hits[0] as PersonAppearanceHit).pa).toBeDefined();
        expect((searchResult.hits[0] as PersonAppearanceHit).pa).toEqual(pa);
      });

      let request = httpMock.expectOne(`${environment.apiUrl}/pas,lifecourses/_search`);
      expect(request.request.method).toBe("POST");
      request.flush(esResult);
      httpMock.verify();
    });*/
  });
});
