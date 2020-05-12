import { Injectable } from '@angular/core';
import { PersonAppearance, SearchResult, SearchHit } from '../search/search.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ElasticDocResult {
  _index: string,
  _type: string,
  _id: number|string,
  _version: number,
  _seq_no: number,
  found: boolean,
  _source: {
    person_appearance: PersonAppearance | PersonAppearance[]
  }
}

export interface ElasticSearchHit {
  _index: string,
  _type: string,
  _id: number,
  _score: number,
  _source: {
    person_appearance: PersonAppearance | PersonAppearance[]
  }
}

export interface ElasticSearchResult {
  took: number,
  timed_out: boolean,
  _shards: {
    total: number,
    successful: number,
    skipped: number,
    failed: number
  },
  hits: {
    total: {
      value: number,
      relation: string
    },
    max_score: number,
    hits: ElasticSearchHit[]
  },
  aggregations: {
    count: {
      doc_count_error_upper_bound: number,
      sum_other_doc_count: number,
      buckets: {
        key: string,
        doc_count: number
      }[]
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {

  constructor(private http: HttpClient) { }

  private handleHit(elasticHit: ElasticSearchHit): SearchHit {
    return {
      type: elasticHit._index,
      pa: elasticHit._index == "pas" ? (elasticHit._source.person_appearance as PersonAppearance) : undefined,
      pas: elasticHit._index == "lifecourses" ? (elasticHit._source.person_appearance as PersonAppearance[]) : undefined
    }
  }

  private handleResult(elasticResult: ElasticSearchResult): SearchResult {
    let result: SearchResult = {
      took: elasticResult.took,
      totalHits: 0,
      indexHits: {},
      hits: []
    };

    result.hits = elasticResult.hits.hits.map<SearchHit>(this.handleHit);

    elasticResult.aggregations.count.buckets.forEach(value => {
      result.totalHits += value.doc_count;
      if (value.key == "pas") {
        result.indexHits.pas = value.doc_count;
      }
      if (value.key == "lifecourses") {
        result.indexHits.lifeCourses = value.doc_count;
      }
    });

    return result;
  }

  search(body: any): Observable<SearchResult> {
    var result = new Observable<SearchResult>(observer => {
      this.http.post<ElasticSearchResult>(`${environment.apiUrl}/pas,lifecourses/_search`, body)
        .subscribe(next => {
          try {
            observer.next(this.handleResult(next));
          } catch (error) {
            observer.error(error);
          }
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });
    });

    return result;
  }

  searchSimple(query: string, indices: string[], from: number, size: number) {
    let body = {
      from: from,
      size: size,
      query: {
        bool: {
          must: [
            {
              nested: {
                path: "person_appearance",
                query: {
                  simple_query_string: {
                    query: query,
                    fields: ["*"],
                    default_operator: "and"
                  }
                }
              }
            }
          ]
        }
      },
      aggs: {
        count: {
          terms: {
            field: "_index"
          }
        }
      },
      post_filter: {
        terms: {
          _index: indices
        }
      }
    };

    return this.search(body);
  }

  doc(index: string, id: string|number): Observable<PersonAppearance|PersonAppearance[]> {
    return new Observable<PersonAppearance|PersonAppearance[]>(
      observer => {
        this.http.get<ElasticDocResult>(`${environment.apiUrl}/${index}/_doc/${id}`)
        .subscribe(next => {
            observer.next(next._source.person_appearance)
          }, error => {
            observer.error(error);
          }, () => {
            observer.complete();
          }
        )
      }
    );
  }
}
