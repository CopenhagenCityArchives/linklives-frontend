import { Injectable } from '@angular/core';
import { PersonAppearance, SearchResult, SearchHit, AdvancedSearchQuery } from '../search/search.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapQueryMustKey, mapQueryShouldKey, sortValues } from 'src/app/search-term-values';

export interface ElasticDocResult {
  _index: "lifecourses" | "pas" | "links",
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
  _index: "lifecourses" | "pas" | "links",
  _type: string,
  _id: number,
  _score: number,
  _source: {
    life_course_ids?: number[],
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
  aggregations?: {
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
    switch (elasticHit._index) {
      case "lifecourses":
        return {
          type: "lifecourses",
          life_course_id: elasticHit._id,
          pas: elasticHit._source.person_appearance as PersonAppearance[]
        };
      case "pas":
        return {
          type: "pas",
          pa: elasticHit._source.person_appearance as PersonAppearance
        };
      case "links":
        return {
          type: "links",
          link_id: elasticHit._id,
          life_course_ids: elasticHit._source.life_course_ids,
          pas: elasticHit._source.person_appearance as [PersonAppearance, PersonAppearance]
        }
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

    elasticResult.aggregations?.count.buckets.forEach(value => {
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

  search(indices: string[], body: any): Observable<SearchResult> {
    var result = new Observable<SearchResult>(observer => {
      this.http.post<ElasticSearchResult>(`${environment.apiUrl}/${indices.join(',')}/_search`, body)
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

  createSortClause(sortBy: string, sortOrder: string) {
    const sortKeys = sortValues[sortBy];

    //sort: undefined should result in a JSON request with no sort field
    if(!sortKeys) {
      return;
    }

    return sortKeys.map((key) => ({ [`person_appearance.${key}`]: { order: sortOrder } }));
  }

  searchAdvanced(query: AdvancedSearchQuery, indices: string[], from: number, size: number, sortBy: string, sortOrder: string) {
    const sort = this.createSortClause(sortBy, sortOrder);

    const must = [];

    Object.keys(query).filter((queryKey) => query[queryKey]).forEach((queryKey) => {
      const value = query[queryKey];

      if(queryKey === "query") {
        must.push({
          simple_query_string: {
            query: value,
            fields: ["*"],
            default_operator: "and",
          },
        });
        return;
      }

      const mustKey = mapQueryMustKey[queryKey];

      if(mustKey) {
        must.push({
          match: { [`person_appearance.${mustKey}`]: value }
        });
        return;
      }

      const shouldKeys = mapQueryShouldKey[queryKey];

      if(shouldKeys) {
        must.push({
          bool: {
            should: shouldKeys.map((shouldKey) => {
              return { match: { [`person_appearance.${shouldKey}`]: value } };
            }),
          },
        });
        return;
      }

      console.warn("[elasticsearch.service] key we don't know how to search on provided", queryKey);
    });

    const body = {
      from: from,
      size: size,
      query: {
        nested: {
          path: "person_appearance",
          query: {
            bool: { must },
          },
        },
      },
      aggs: {
        count: {
          terms: {
            field: "_index"
          }
        },
        person_appearance: {
          nested: { path: "person_appearance" },
          aggs:{
            source_years: {
              terms: { field: "person_appearance.source_year", size: 10000 }
            },
          }
        },
      },
      post_filter: {
        terms: {
          _index: indices
        }
      },
      sort,
    };

    return this.search(indices, body);
  }

  getDocument(index: string, id: string|number): Observable<PersonAppearance|PersonAppearance[]> {
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
  
  getDocuments(documents: {index: string, id: string|number}[]) {
    let body = {
      docs: documents.map(doc => { return { _index: doc.index, _id: doc.id } })
    };

    return new Observable<PersonAppearance[]>(
      observer => {
        this.http.post<{ docs: ElasticDocResult[] }>(`${environment.apiUrl}/mget`, body)
        .subscribe(next => {
          observer.next(next.docs.map(doc => doc._source.person_appearance as PersonAppearance));
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        })
      }
    )
  }
}
