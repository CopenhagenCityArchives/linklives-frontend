import { Injectable, EventEmitter } from '@angular/core';
import { PersonAppearance, SearchResult, SearchHit, AdvancedSearchQuery, Source } from '../search/search.service';
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
    },
    person_appearance: {
      source_years: {
        buckets: {
          key: number,
          doc_count: number
        }[]
      }
    }
  }
}

export interface Link {
  pa_id1: string,
  pa_id2: string,
  source_id1: string,
  source_id2: string,
  method_type: string,
  method_subtype1: string,
  score: number,
}

export interface LinksSearchResult {
  hits: {
    hits: [
      {
        _source: {
          link: Link,
        }
      }
    ]
  }
}

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {

  constructor(private http: HttpClient) { }

  private handleHit(elasticHit: ElasticSearchHit): SearchHit {
    if(elasticHit._index.startsWith("lifecourses")) {
      return {
        type: "lifecourses",
        life_course_id: elasticHit._id,
        pas: elasticHit._source.person_appearance as PersonAppearance[]
      };
    }

    if(elasticHit._index.startsWith("pas")) {
      return {
        type: "pas",
        pa: elasticHit._source.person_appearance as PersonAppearance
      };
    }

    if(elasticHit._index.startsWith("links")) {
      return {
        type: "links",
        link_id: elasticHit._id,
        life_course_ids: elasticHit._source.life_course_ids,
        pas: elasticHit._source.person_appearance as [PersonAppearance, PersonAppearance]
      };
    }

    throw {
      trace: new Error("Got unknown type of elasticHit (not in known index)"),
      elasticHit,
    };
  }

  private handleResult(elasticResult: ElasticSearchResult): SearchResult {
    let result: SearchResult = {
      took: elasticResult.took,
      totalHits: 0,
      indexHits: {},
      hits: [],
      meta: {
        possibleYears: elasticResult.aggregations?.person_appearance?.source_years?.buckets.map((bucket) => bucket.key) ?? [],
      },
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

  loading = new EventEmitter<boolean>();

  search(indices: string[], body: any): Observable<SearchResult> {
    // TODO: Prettifiy the loading overlay code.
    this.loading.emit(true);
    var result = new Observable<SearchResult>(observer => {
      this.http.post<ElasticSearchResult>(`${environment.apiUrl}/${indices.join(',')}/_search`, body)
        .subscribe(next => {
          try {
            observer.next(this.handleResult(next));
          } catch (error) {
            observer.error(error);
          }
        }, error => {
          window.setTimeout(function() {
            this.loading.emit(false);
          }, 3000);
          observer.error(error);
        }, () => {
          observer.complete();
            this.loading.emit(false);
        });
    });
    return result;
  }

  createSortClause(sortBy: string, sortOrder: string) {
    const sortKeys = sortValues[sortBy];

    //sort: undefined should result in a JSON request with no sort field
    if(!sortKeys) {
      return undefined;
    }

    return sortKeys.map((key: string) => {
      if(key == "_score") {
        return { _score: { order: sortOrder } };
      }

      const qualifiedKey = `person_appearance.${key}`;

      return {
        [qualifiedKey]: {
          order: sortOrder,
          mode: "max",
          nested: {
            path: "person_appearance",
          },
        }
      };
    });
  }

  searchAdvanced(query: AdvancedSearchQuery, indices: string[], from: number, size: number, sortBy: string, sortOrder: string, sourceFilter: number[]) {
    if(indices.length < 1) {
      const emptySearchResult = new Observable<SearchResult>((observer) => {
        observer.next({
          took: 0,
          totalHits: 0,
          indexHits: {},
          hits: [],
          meta: { possibleYears: [] },
        });

        observer.complete();
      });
      return emptySearchResult;
    }

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

    if(sourceFilter.length) {
      must.push({
        bool: {
          should: sourceFilter.map((sourceYear) => {
            return { match: { [`person_appearance.source_year`]: sourceYear } };
          }),
        },
      })
    }

    const body = {
      from: from,
      size: size,
      indices_boost: [
        { 'lifecourses': 1.05 },
      ],
      query: {
        nested: {
          path: "person_appearance",
          query: {
            bool: { must },
          },
          score_mode: "max",
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

  getDocument(index: string, id: string|number): Observable<Source|PersonAppearance|PersonAppearance[]> {
    return new Observable<Source|PersonAppearance|PersonAppearance[]>(
      observer => {
        this.http.get<ElasticDocResult>(`${environment.apiUrl}/${index}/_doc/${id}`)
        .subscribe(next => {
            const typeKey = Object.keys(next._source).find((key) => !key.includes("id"));
            observer.next(next._source[typeKey]);
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

  searchLinks(pas: PersonAppearance[]): Observable<Link[]> {
    const idMatches = pas.map((pa) => ({
      bool: {
        must: [
          { match: { "person_appearance.pa_id": pa.pa_id } },
          { match: { "person_appearance.source_id": pa.source_id } },
        ]
      }
    }));

    const body = {
      query: {
        nested: {
          path: "person_appearance",
          query: {
            bool: {
              should: idMatches,
            }
          }
        }
      }
    };

    const result = new Observable<Link[]>(observer => {
      this.http.post<LinksSearchResult>(`${environment.apiUrl}/links/_search`, body)
        .subscribe(next => {
          try {
            const links: Link[] = next.hits.hits
              .map((hit) => hit._source.link)
              .map((link) => ({
                pa_id1: link.pa_id1,
                pa_id2: link.pa_id2,
                source_id1: link.source_id1,
                source_id2: link.source_id2,
                method_type: link.method_type,
                method_subtype1: link.method_subtype1,
                score: link.score,
              }));

            observer.next(links);
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
}
