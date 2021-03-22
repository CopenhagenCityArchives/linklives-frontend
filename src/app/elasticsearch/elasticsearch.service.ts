import { Injectable, EventEmitter } from '@angular/core';
import { PersonAppearance, SearchResult, SearchHit, AdvancedSearchQuery, Source, SourceIdentifier } from '../search/search.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapSearchKeys, sortValues } from 'src/app/search-term-values';
import { map, share } from 'rxjs/operators';

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
  }
}

export interface ElasticSourceLookupResult {
  aggregations?: {
    person_appearance: {
      sources: {
        buckets: {
          key: { source_year: number, event_type: string },
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

  private handleResult(searchResult: ElasticSearchResult, sourceLookupResult?: ElasticSourceLookupResult): SearchResult {
    const result: SearchResult = {
      took: searchResult.took,
      totalHits: 0,
      indexHits: {},
      hits: [],
      meta: {
        possibleSources: sourceLookupResult?.aggregations?.person_appearance?.sources?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [],
      },
    };

    result.hits = searchResult.hits.hits.map<SearchHit>(this.handleHit);

    searchResult.aggregations?.count.buckets.forEach(value => {
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

  search(indices: string[], body: any, sourceFilterBody?: any): Observable<SearchResult> {
    const loadingEmitter = this.loading;
    loadingEmitter.emit(true);

    interface SearchRequests {
      search: Observable<ElasticSearchResult>,
      sourceLookup?: Observable<ElasticSourceLookupResult>,
    };
    const requests: SearchRequests = {
      search: this.http.post<ElasticSearchResult>(`${environment.apiUrl}/${indices.join(',')}/_search`, body).pipe(share()),
    };

    if(sourceFilterBody) {
      requests.sourceLookup = this.http.post<ElasticSourceLookupResult>(`${environment.apiUrl}/${indices.join(',')}/_search`, sourceFilterBody).pipe(share());
    }

    // Prep observable that will send both requests and merge results in handleResult
    const observable = forkJoin(requests)
      .pipe(map(({ search, sourceLookup }) => {
        loadingEmitter.emit(false);
        return this.handleResult(search, sourceLookup);
      }));

    // Handle loading by listening to the observable
    observable.subscribe({
      error() {
        window.setTimeout(() => loadingEmitter.emit(false), 3000);
      },

      complete() {
        loadingEmitter.emit(false);
      }
    });

    // Return observable so the caller of this function can listen to it
    return observable;
  }

  createSortClause(sortBy: string, sortOrder: string) {
    const sortKeys = sortValues[sortBy];

    //sort: undefined should result in a JSON request with no sort field
    if(!sortKeys) {
      return undefined;
    }

    return sortKeys.map((key: string) => {
      if(key == "_score") {
        // Special case: _score is top-level, not on person_appearance
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

  searchAdvanced(query: AdvancedSearchQuery, indices: string[], from: number, size: number, sortBy: string, sortOrder: string, sourceFilter: SourceIdentifier[], mode: string = "default") {
    if(indices.length < 1) {
      const emptySearchResult = new Observable<SearchResult>((observer) => {
        observer.next({
          took: 0,
          totalHits: 0,
          indexHits: {},
          hits: [],
          meta: { possibleSources: [] },
        });

        observer.complete();
      });
      return emptySearchResult;
    }

    const sort = this.createSortClause(sortBy, sortOrder);

    const { resultLookupQuery, sourceLookupQuery } = this.createQueries(query, sourceFilter, mode);

    const body = {
      from: from,
      size: size,
      indices_boost: [
        { 'lifecourses': 1.05 },
      ],
      query: resultLookupQuery,
      post_filter: {
        terms: {
          _index: indices
        }
      },
      aggs: {
        count: {
          terms: {
            field: "_index"
          }
        },
      },
      sort,
    };

    const sourceFilterBody = {
      from: from,
      size: 0,
      query: sourceLookupQuery,
      aggs: {
        person_appearance: {
          nested: { path: "person_appearance" },
          aggs:{
            sources: {
              composite: {
                sources: [
                  { source_year: { terms: { field: "person_appearance.source_year_agg" } } },
                  { event_type: { terms: { field: "person_appearance.event_type_agg" } } },
                ],
                size: 10000
              }
            },
          }
        },
      },
      post_filter: {
        terms: {
          _index: indices
        }
      },
    };

    return this.search(indices, body, sourceFilterBody);
  }

  createQueries(query: AdvancedSearchQuery, sourceFilter: SourceIdentifier[], mode: string) {
    const must = [];
    let sourceLookupFilter = must;

    Object.keys(query).filter((queryKey) => query[queryKey]).forEach((queryKey) => {
      const value = query[queryKey];

      // Special case: query
      if(queryKey === "query") {
        must.push({
          simple_query_string: {
            query: value,
            fields: ["*"],
            default_operator: "and",
            analyze_wildcard: true,
          },
        });
        return;
      }

      const searchKeyConfig = mapSearchKeys[queryKey];

      if(!searchKeyConfig && queryKey != "lifeCourseId") {
        return console.warn("[elasticsearch.service] key we don't know how to search on provided", queryKey);
      }

      const searchKey = searchKeyConfig[mode] || searchKeyConfig.default;

      if(searchKey) {
        if(/[\?\*]/.test(value)) {
          must.push({
            wildcard: {
              [`person_appearance.${searchKey}`]: {
                value: value,
              }
            }
          });
          return;
        }

        must.push({
          match: {
            [`person_appearance.${searchKey}`]: {
              query: value,
              fuzziness: "AUTO",
              max_expansions: 250,
              operator: "AND"
            }
          }
        });
        return;
      }

      if(searchKeyConfig.exact) {
        must.push({
          term: { [`person_appearance.${searchKeyConfig.exact}`]: value }
        });
      }
    });

    if(sourceFilter.length) {
      // Copy must into sourceLookupFilter to avoid the following push being added to this list, too
      sourceLookupFilter = [ ...must ];

      // Add source filter to only the must filter (but not the source lookup filter)
      must.push({
        bool: {
          should: sourceFilter.map(({ source_year, event_type }) => {
            return {
              bool: {
                must: [
                  { match: { [`person_appearance.source_year_agg`]: source_year } },
                  { match: { [`person_appearance.event_type_agg`]: event_type } },
                ]
              }
            };
          }),
        },
      })
    }

    const getFullPersonAppearanceQueryFromMustQuery = (must) => ({
      nested: {
        path: "person_appearance",
        query: {
          bool: { must },
        },
        score_mode: "max",
      },
    });

    const resultLookupQuery: Record<string, any> = getFullPersonAppearanceQueryFromMustQuery(must);
    const sourceLookupQuery: Record<string, any> = getFullPersonAppearanceQueryFromMustQuery(sourceLookupFilter);

    if(!query.lifeCourseId) {
      return { resultLookupQuery, sourceLookupQuery };
    }

    // Special case: life_course_id
    const includeLifeCouseInQuery = (oldQuery) => ({
      bool: {
        must: [
          { term: { life_course_id: query.lifeCourseId } },
          oldQuery,
        ]
      }
    });

    return {
      resultLookupQuery: includeLifeCouseInQuery(resultLookupQuery),
      sourceLookupQuery: includeLifeCouseInQuery(sourceLookupQuery),
    };
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
