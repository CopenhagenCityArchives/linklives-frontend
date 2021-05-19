import { Injectable, EventEmitter } from '@angular/core';
import { PersonAppearance, Lifecourse, SearchResult, SearchHit, AdvancedSearchQuery, Source, FilterIdentifier } from '../search/search.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapSearchKeys, sortValues } from 'src/app/search-term-values';
import { map, share } from 'rxjs/operators';
import groupBy from 'lodash.groupby';

export interface ElasticDocResult {
  _index: "lifecourses" | "pas" | "links",
  _type: string,
  _id: number|string,
  _version: number,
  _seq_no: number,
  found: boolean,
  _source: {
    life_course_id?: number,
    source?: Source,
    person_appearance?: PersonAppearance | PersonAppearance[]
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
          key: {
            event_year_display: string,
            event_type: string
            event_type_display: string // only used for displaying
          },
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
        possibleFilters: sourceLookupResult?.aggregations?.person_appearance?.sources?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [],
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

  searchAdvanced(query: AdvancedSearchQuery, indices: string[], from: number, size: number, sortBy: string, sortOrder: string, sourceFilter: FilterIdentifier[], mode: string = "default") {
    if(indices.length < 1) {
      const emptySearchResult = new Observable<SearchResult>((observer) => {
        observer.next({
          took: 0,
          totalHits: 0,
          indexHits: {},
          hits: [],
          meta: { possibleFilters: [] },
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
                  { event_year_display: { terms: { field: "person_appearance.event_year_display" } } },
                  { event_type: { terms: { field: "person_appearance.event_type" } } },
                  { event_type_display: { terms: { field: "person_appearance.event_type_display" } } },
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

  createQueries(query: AdvancedSearchQuery, sourceFilter: FilterIdentifier[], mode: string) {
    const must = [];
    let sourceLookupFilter = must;

    Object.keys(query).filter((queryKey) => query[queryKey]).forEach((queryKey) => {
      let value = query[queryKey];

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

      if(searchKeyConfig.exact) {
        must.push({
          term: { [`person_appearance.${searchKeyConfig.exact}`]: value }
        });
        return;
      }

      const searchKey = searchKeyConfig[mode];

      const getSearchKeyQuery = (searchKey, value) => {
        const searchKeySubQuery = [];

        if(value.includes('"')) {
          const parts = value.split('"');

          // If there are less than 3 parts, there is only one quotation mark
          // Likewise, the number of parts must be uneven if there is an even number of quotation marks
          if(parts.length >= 3 && parts.length % 2 == 1) {
            // Quoted parts are every other part starting at index 1
            const quoted = parts.filter((_, i) => i % 2 == 1);

            // Unquoted parts are the opposite
            const unquoted = parts.filter((_, i) => i % 2 == 0);

            quoted.forEach((quotedValue) => {
              searchKeySubQuery.push({
                match_phrase: {
                  [`person_appearance.${searchKey}`]: {
                    query: quotedValue,
                  },
                },
              });
            });

            // We send the unquoted parts back to normal value handling.
            // If there are none, we don't need to continue.
            value = unquoted.join(" ").trim();
          }
        }

        if(!value) {
          // Everything was quoted
          if(searchKeySubQuery.length > 1) {
            return { bool: { must: searchKeySubQuery } };
          }

          return searchKeySubQuery[0];
        }

        const terms = value.split(/\s+/g);
        const wildcardTerms = terms.filter((value) => /[\?\*]/.test(value));
        const nonWildcardTerms = terms.filter((value) => !/[\?\*]/.test(value));

        wildcardTerms.forEach((value) => {
          searchKeySubQuery.push({
            wildcard: {
              [`person_appearance.${searchKey}`]: {
                value,
              }
            }
          });
        });

        if(nonWildcardTerms.length) {
          searchKeySubQuery.push({
            match: {
              [`person_appearance.${searchKey}`]: {
                // Match query splits into terms on space, so we can simplify the query here
                query: nonWildcardTerms.join(" "),
                //max_expansions: 250,

                operator: "AND"
              }
            }
          });
        }

        if(searchKeySubQuery.length > 1) {
          return { bool: { must: searchKeySubQuery } };
        }

        return searchKeySubQuery[0];
      }

      const searchKeyQuery = getSearchKeyQuery(searchKey, value);
      must.push(searchKeyQuery);
    });

    if(sourceFilter.length) {
      // Copy must into sourceLookupFilter to avoid the following push being added to this list, too
      sourceLookupFilter = [ ...must ];

      const addFiltersToQuery = (filters) => {
        const grouped = groupBy(filters, 'filter_type');

        return grouped['eventType'].map(({ event_year_display, event_type, event_type_display }) => {
          return {
            bool: {
              must: [
                { match: { [`person_appearance.event_year_display`]: event_year_display } },
                { match: { [`person_appearance.event_type`]: event_type } },
                { match: { [`person_appearance.event_type_display`]: event_type_display } },
              ]
            }
          };
        });
      }
      // Add source filter to only the must filter (but not the source lookup filter)
      must.push({
        bool: {
          should: addFiltersToQuery(sourceFilter),
        },
      })
    }

    const simplifiedQueryFromMust = (must) => {
      if(must.length == 1) {
        return must[0];
      }
      return {
        bool: { must },
      };
    };

    const getFullPersonAppearanceQueryFromMustQuery = (must) => ({
      nested: {
        path: "person_appearance",
        query: simplifiedQueryFromMust(must),
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

  getLifecourse(id: string|number): Observable<Lifecourse> {
    return new Observable(
      observer => {
        this.http.get<ElasticDocResult>(`${environment.apiUrl}/lifecourses/_doc/${id}`)
        .subscribe(next => {
            observer.next(next._source as Lifecourse);
          }, error => {
            observer.error(error);
          }, () => {
            observer.complete();
          }
        )
      }
    );
  }

  getSource(id: string|number): Observable<Source> {
    return new Observable(
      observer => {
        this.http.get<ElasticDocResult>(`${environment.apiUrl}/sources/_doc/${id}`)
        .subscribe(next => {
            observer.next(next._source.source as Source);
          }, error => {
            observer.error(error);
          }, () => {
            observer.complete();
          }
        )
      }
    );
  }

  getPersonAppearance(id: string|number): Observable<PersonAppearance> {
    return new Observable(
      observer => {
        this.http.get<ElasticDocResult>(`${environment.apiUrl}/pas/_doc/${id}`)
        .subscribe(next => {
            observer.next(next._source.person_appearance as PersonAppearance);
          }, error => {
            observer.error(error);
          }, () => {
            observer.complete();
          }
        )
      }
    );
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
