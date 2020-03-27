import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface PersonalAppearance {
  life_course_id: Number,
  link_id: Number,
  method_id: Number,
  pa_id: Number,
  score: Number,
  source_id: Number,
  name: String,
  sex: String,
  age: Number,
  birthplace: String,
  parish: String,
  county: String,
  district: String,
  name_clean: String,
  age_clean: Number,
  sex_clean: String,
  name_std: String,
  firstnames_std: String,
  surnames_std: String,
  county_std: String,
  parish_std: String,
  district_std: String
}

export interface SearchResult {
  took: Number,
  timed_out: Boolean,
  _shards: {
    total: Number,
    successful: Number,
    skipped: Number,
    failed: Number
  },
  hits: {
    total: {
      value: Number,
      relation: String
    },
    max_score: Number,
    hits: [
      {
        _index: String,
        _type: String,
        _id: Number,
        _score: Number,
        _source: {
          personal_appearance: PersonalAppearance | [PersonalAppearance]
        }
      }
    ]
  }
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  simpleSearch(query: String, from: Number, size: Number): Observable<SearchResult> {
    let body = {
      from: from,
      size: size,
      query: {
        nested: {
          path: "personal_appearance",
          query: {
            bool: {
              must: [
                {
                  match: {
                    "personal_appearance.firstnames_std": query
                  }
                }
              ]
            }
          }
        }
      }
    };
    return this.http.post<SearchResult>(`${environment.apiUrl}/pas,lifecourses/_search`, body);
  }
}
