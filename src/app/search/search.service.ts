import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

export interface SearchResult {
  took: number,
  totalHits: number,
  indexHits: {
    lifeCourses?: number,
    pas?: number,
    links?: number
  },
  hits: {
    type: string,
    pa?: PersonalAppearance,
    pas?: PersonalAppearance[]
  }[]
}

export interface PersonalAppearance {
  life_course_id: number,
  link_id: number,
  method_id: number,
  pa_id: number,
  score: number,
  source_id: number,
  name: string,
  sex: string,
  age: number,
  birthplace: string,
  parish: string,
  county: string,
  district: string,
  name_clean: string,
  age_clean: number,
  sex_clean: string,
  name_std: string,
  firstnames_std: string,
  surnames_std: string,
  county_std: string,
  parish_std: string,
  district_std: string
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
    hits: [
      {
        _index: string,
        _type: string,
        _id: number,
        _score: number,
        _source: {
          personal_appearance: PersonalAppearance | [PersonalAppearance]
        }
      }
    ]
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
export class SearchService {

  constructor(private http: HttpClient) { }

  simpleSearch(query: string, index: string, from: number, size: number): Observable<SearchResult> {
    let body = {
      from: from,
      size: size,
      query: {
        nested: {
          path: "personal_appearance",
          query: {
            simple_query_string: {
              query: query,
              fields: ["*"],
              default_operator: "and"
            }
          }
        }
      },
      aggs: {
        count: {
          terms: {
            field: "_index"
          }
        }
      }
    };

    var result = new Observable<SearchResult>(subscriber => {
      this.http.post<ElasticSearchResult>(`${environment.apiUrl}/${index}/_search`, body)
        .subscribe(next => {
          let result: SearchResult = {
            took: next.took,
            totalHits: next.hits.total.value,
            indexHits: {},
            hits: []
          };
          next.hits.hits.forEach(value => {
            let hit = {
              type: value._index,
              pa: value._index == "pas" ? (value._source.personal_appearance as PersonalAppearance) : undefined,
              pas: value._index == "lifecourses" ? (value._source.personal_appearance as PersonalAppearance[]) : undefined
            }
            result.hits.push(hit)
          });
          next.aggregations.count.buckets.forEach(value => {
            if (value.key == "pas") {
              result.indexHits.pas = value.doc_count;
            }
            if (value.key == "lifecourses") {
              result.indexHits.lifeCourses = value.doc_count;
            }
          });
          subscriber.next(result);
        }, error => {
          subscriber.error(error);
        }, () => {
          subscriber.complete();
        });
    });

    return result;
  }
}
