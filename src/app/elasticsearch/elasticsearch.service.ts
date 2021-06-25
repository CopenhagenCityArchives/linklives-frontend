import { Injectable, EventEmitter } from '@angular/core';
import { PersonAppearance, Lifecourse, SearchResult, SearchHit, AdvancedSearchQuery, Source, FilterIdentifier } from '../search/search.service';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapSearchKeys, sortValues } from 'src/app/search-term-values';
import { map, share } from 'rxjs/operators';
import groupBy from 'lodash.groupby';
import { catchError, retry } from 'rxjs/operators';

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

interface SourceLookupKeys {
  source_type_wp4: string
  source_type_display: string // only used for displaying
}

interface EventLookupKeys {
  event_type: string
  event_type_display: string // only used for displaying
}

interface SourceYearLookupKeys {
  source_year: string
  source_year_display: string // only used for displaying
}

interface EventYearLookupKeys {
  //event_year: string
  event_year_display: string // only used for displaying
}
interface BirthYearLookupKeys {
  birth_year: string
  birthyear_display: string // only used for displaying
}

interface DeathYearLookupKeys {
  deathyear_searchable: string
  deathyear_display: string // only used for displaying
}

export interface ElasticSourceLookupResult {
  aggregations?: {
    person_appearance: {
      sources: {
        buckets: {
          key: SourceLookupKeys,
          doc_count: number
        }[]
      }
    }
  }
}

export interface ElasticEventLookupResult {
  aggregations?: {
    person_appearance: {
      sources: {
        buckets: {
          key: EventLookupKeys,
          doc_count: number
        }[]
      }
    }
  }
}

export interface ElasticSourceYearLookupResult {
  aggregations?: {
    person_appearance: {
      sources: {
        buckets: {
          key: SourceYearLookupKeys,
          doc_count: number
        }[]
      }
    }
  }
}
export interface ElasticEventYearLookupResult {
  aggregations?: {
    person_appearance: {
      sources: {
        buckets: {
          key: EventYearLookupKeys,
          doc_count: number
        }[]
      }
    }
  }
}
export interface ElasticBirthYearLookupResult {
  aggregations?: {
    person_appearance: {
      sources: {
        buckets: {
          key: BirthYearLookupKeys,
          doc_count: number
        }[]
      }
    }
  }
}
export interface ElasticDeathYearLookupResult {
  aggregations?: {
    person_appearance: {
      sources: {
        buckets: {
          key: DeathYearLookupKeys,
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

export interface RatingOption {
  id: number,
  text: string,
  heading: string,
}

export interface LinkRatingOptionsResult {
  [index: number]: RatingOption;
}

export interface Option {
  value: number,
  label: string,
}
export interface LinkRatingCategegory {
  category: string,
  options: Option[]
}
export interface LinkRatingOptions {
  [index: number]: LinkRatingCategegory;
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

  private handleResult(searchResult: ElasticSearchResult,
      eventLookupResult?: ElasticEventLookupResult,
      sourceLookupResult?: ElasticSourceLookupResult,
      eventYearLookupResult?: ElasticEventYearLookupResult,
      sourceYearLookupResult?: ElasticSourceYearLookupResult,
      birthYearLookupResult?: ElasticBirthYearLookupResult,
      deathYearLookupResult?: ElasticDeathYearLookupResult,
      ): SearchResult {
    const possibleFilters = {
      eventType: eventLookupResult?.aggregations?.person_appearance?.sources?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [],
      source: sourceLookupResult?.aggregations?.person_appearance?.sources?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [],
      eventYear: eventYearLookupResult?.aggregations?.person_appearance?.sources?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [],
      sourceYear: sourceYearLookupResult?.aggregations?.person_appearance?.sources?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [],
      birthYear: birthYearLookupResult?.aggregations?.person_appearance?.sources?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [],
      deathYear: deathYearLookupResult?.aggregations?.person_appearance?.sources?.buckets.map((bucket) => ({ ...bucket.key, count: bucket.doc_count })) ?? [],
    }
    const result: SearchResult = {
      took: searchResult.took,
      totalHits: 0,
      indexHits: {},
      hits: [],
      meta: {
        possibleFilters,
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

  search(indices: string[], body: any, eventFilterBody?: any, sourceFilterBody?: any, eventYearFilterBody?: any, sourceYearFilterBody?: any, birthYearFilterBody?: any, deathYearFilterBody?: any): Observable<SearchResult> {
    const loadingEmitter = this.loading;
    loadingEmitter.emit(true);

    interface SearchRequests {
      search: Observable<ElasticSearchResult>,
      eventLookup?: Observable<ElasticEventLookupResult>,
      sourceLookup?: Observable<ElasticSourceLookupResult>,
      eventYearLookup?: Observable<ElasticEventYearLookupResult>,
      sourceYearLookup?: Observable<ElasticSourceYearLookupResult>,
      birthYearLookup?: Observable<ElasticBirthYearLookupResult>,
      deathYearLookup?: Observable<ElasticDeathYearLookupResult>,
    };
    const requests: SearchRequests = {
      search: this.http.post<ElasticSearchResult>(`${environment.apiUrl}/search/${indices.join(',')}`, body).pipe(share()),
    };
    if(eventFilterBody) {
      requests.eventLookup = this.http.post<ElasticEventLookupResult>(`${environment.apiUrl}/search/${indices.join(',')}`, eventFilterBody).pipe(share());
    }

    if(sourceFilterBody) {
      requests.sourceLookup = this.http.post<ElasticSourceLookupResult>(`${environment.apiUrl}/search/${indices.join(',')}`, sourceFilterBody).pipe(share());
    }

    if(eventYearFilterBody) {
      requests.eventYearLookup = this.http.post<ElasticEventYearLookupResult>(`${environment.apiUrl}/search/${indices.join(',')}`, eventYearFilterBody).pipe(share());
    }

    if(sourceYearFilterBody) {
      requests.sourceYearLookup = this.http.post<ElasticSourceYearLookupResult>(`${environment.apiUrl}/search/${indices.join(',')}`, sourceYearFilterBody).pipe(share());
    }

    if(birthYearFilterBody) {
      requests.birthYearLookup = this.http.post<ElasticBirthYearLookupResult>(`${environment.apiUrl}/search/${indices.join(',')}`, birthYearFilterBody).pipe(share());
    }

    if(deathYearFilterBody) {
      requests.deathYearLookup = this.http.post<ElasticDeathYearLookupResult>(`${environment.apiUrl}/search/${indices.join(',')}`, deathYearFilterBody).pipe(share());
    }

    // Prep observable that will send both requests and merge results in handleResult
    const observable = forkJoin(requests)
      .pipe(map(({ search, eventLookup, sourceLookup, eventYearLookup, sourceYearLookup, birthYearLookup, deathYearLookup }) => {
        loadingEmitter.emit(false);
        return this.handleResult(search, eventLookup, sourceLookup, eventYearLookup, sourceYearLookup, birthYearLookup, deathYearLookup);
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
          meta: { possibleFilters:
            {
              eventType: [],
              source: [],
              eventYear: [],
              sourceYear: [],
              birthYear: [],
              deathYear: [],
            }
          },
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

    const sources = {
      eventType: [
        { event_type: { terms: { field: "person_appearance.event_type" } } },
        { event_type_display: { terms: { field: "person_appearance.event_type_display" } } },
      ],
      source: [
        { source_type_wp4: { terms: { field: "person_appearance.source_type_wp4" } } },
        { source_type_display: { terms: { field: "person_appearance.source_type_display" } } },
      ],
      eventYear: [
        //{ event_year: { terms: { field: "person_appearance.event_year" } } },
        { event_year_display: { terms: { field: "person_appearance.event_year_display" } } },
      ],
      sourceYear: [
        { source_year: { terms: { field: "person_appearance.source_year" } } },
        { source_year_display: { terms: { field: "person_appearance.source_year_display" } } },
      ],
      birthYear: [
        { birth_year: { terms: { field: "person_appearance.birth_year" } } },
        { birthyear_display: { terms: { field: "person_appearance.birthyear_display" } } },
      ],
      deathYear: [
        { deathyear_searchable: { terms: { field: "person_appearance.deathyear_searchable" } } },
        { deathyear_display: { terms: { field: "person_appearance.deathyear_display" } } },
      ],
    }

    const filterBody = (filterType) => ({
      from: from,
      size: 0,
      query: sourceLookupQuery,
      aggs: {
        person_appearance: {
          nested: { path: "person_appearance" },
          aggs:{
            sources: {
              composite: {
                sources: sources[filterType],
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
    });

    return this.search(indices, body, filterBody('eventType'), filterBody('source'), filterBody('eventYear'), filterBody('sourceYear'), filterBody('birthYear'), filterBody('deathYear'));
  }

  createQueries(query: AdvancedSearchQuery, sourceFilter: FilterIdentifier[], mode: string) {
    const must = [];
    let sourceLookupFilter = must;

    Object.keys(query).filter((queryKey) => query[queryKey]).forEach((queryKey) => {
      let value = query[queryKey];

      // Special case: query
      if(queryKey === "query") {
        // only string fields
        let fields = [
          "*name_searchable",
          "*lastname_searchable",
          "*firstnames_searchable",
          "*birthplace_searchable",
          "*sourceplace_searchable",
          "*gender_searchable",
          "*birthname_searchable",
        ];

        if(mode === "fuzzy") {
          const fuzzyStringFields = [
            "*name_searchable_fz",
            "*lastname_searchable_fz",
            "*firstnames_searchable_fz",
            "*birthplace_searchable_fz",
            "*birthname_searchable_fz",
          ];
          fields = fields.concat(fuzzyStringFields);
        }
        must.push({
          simple_query_string: {
            query: value,
            fields,
            default_operator: "and",
            analyze_wildcard: true,
          },
        });
        return;
      }

      const searchKeyConfig = mapSearchKeys[queryKey];

      // special case handled at the end of this method
      if(queryKey == "lifeCourseId") {
        return;
      }

      if(!searchKeyConfig) {
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

      const filtersGroupedByFilterType = groupBy(sourceFilter, 'filter_type');

      const eventTypeFilters = (filtersGroupedByFilterType) => {
        return filtersGroupedByFilterType['eventType'].map(({ event_type, event_type_display }) => {
          return {
            bool: {
              must: [
                { match: { [`person_appearance.event_type`]: event_type } },
                { match: { [`person_appearance.event_type_display`]: event_type_display } },
              ]
            }
          };
        });
      }

      const sourceTypeFilters = (filtersGroupedByFilterType) => {
        return filtersGroupedByFilterType['source'].map(({ source_type_wp4, source_type_display }) => {
          return {
            bool: {
              must: [
                { match: { [`person_appearance.source_type_wp4`]: source_type_wp4 } },
                { match: { [`person_appearance.source_type_display`]: source_type_display } },
              ]
            }
          };
        });
      }

      const eventYearFilters = (filtersGroupedByFilterType) => {
        return filtersGroupedByFilterType['eventYear'].map(({ event_year, event_year_display }) => {
          return {
            bool: {
              must: [
                //{ match: { [`person_appearance.event_year`]: event_year } },
                { match: { [`person_appearance.event_year_display`]: event_year_display } },
              ]
            }
          };
        });
      }

      const sourceYearFilters = (filtersGroupedByFilterType) => {
        return filtersGroupedByFilterType['sourceYear'].map(({ source_year, source_year_display }) => {
          return {
            bool: {
              must: [
                { match: { [`person_appearance.source_year`]: source_year } },
                { match: { [`person_appearance.source_year_display`]: source_year_display } },
              ]
            }
          };
        });
      }

      const birthYearFilters = (filtersGroupedByFilterType) => {
        return filtersGroupedByFilterType['birthYear'].map(({ birth_year, birthyear_display }) => {
          return {
            bool: {
              must: [
                { match: { [`person_appearance.birth_year`]: birth_year } },
                { match: { [`person_appearance.birthyear_display`]: birthyear_display } },
              ]
            }
          };
        });
      }

      const deathYearFilters = (filtersGroupedByFilterType) => {
        return filtersGroupedByFilterType['deathYear'].map(({ deathyear_searchable, deathyear_display }) => {
          return {
            bool: {
              must: [
                { match: { [`person_appearance.deathyear_searchable`]: deathyear_searchable } },
                { match: { [`person_appearance.deathyear_display`]: deathyear_display } },
              ]
            }
          };
        });
      }

      // Add source filter to only the must filter (but not the source lookup filter)
      if(filtersGroupedByFilterType['eventType'] && filtersGroupedByFilterType['eventType'].length) {
        must.push({
          bool: {
            should: eventTypeFilters(filtersGroupedByFilterType),
          },
        })
      }

      if(filtersGroupedByFilterType['source'] && filtersGroupedByFilterType['source'].length) {
        must.push({
          bool: {
            should: sourceTypeFilters(filtersGroupedByFilterType),
          },
        })
      }

      console.log('filtersGroupedByFilterType', filtersGroupedByFilterType);

      if(filtersGroupedByFilterType['eventYear'] && filtersGroupedByFilterType['eventYear'].length) {
        must.push({
          bool: {
            should: eventYearFilters(filtersGroupedByFilterType),
          },
        })
      }

      if(filtersGroupedByFilterType['sourceYear'] && filtersGroupedByFilterType['sourceYear'].length) {
        must.push({
          bool: {
            should: sourceYearFilters(filtersGroupedByFilterType),
          },
        })
      }

      if(filtersGroupedByFilterType['birthYear'] && filtersGroupedByFilterType['birthYear'].length) {
        must.push({
          bool: {
            should: birthYearFilters(filtersGroupedByFilterType),
          },
        })
      }

      if(filtersGroupedByFilterType['deathYear'] && filtersGroupedByFilterType['deathYear'].length) {
        must.push({
          bool: {
            should: deathYearFilters(filtersGroupedByFilterType),
          },
        })
      }
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
        // this.http.get<ElasticDocResult>(`${environment.apiUrl}/lifecourse/${id}`)
        this.http.get<ElasticDocResult>(`https://data-dev.link-lives.dk/lifecourses/_doc/${id}`)
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
        this.http.get<ElasticDocResult>(`https://data-dev.link-lives.dk/sources/_doc/${id}`)
        .subscribe(resBody => {
            observer.next(resBody._source.source as Source);
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
        this.http.get<ElasticDocResult>(`${environment.apiUrl}/PersonAppearance/${id}`)
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
      this.http.post<LinksSearchResult>(`https://data-dev.link-lives.dk/links/_search`, body)
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

  getLinkRatingOptions(): Observable<LinkRatingOptions> {
    return new Observable<LinkRatingOptions>(    
      observer => {
        this.http.get<LinkRatingOptionsResult>(`${environment.apiUrl}/ratingOptions`)
        .subscribe(responseBody => {
          try {
            const linkRatingOptions = [];

            for (const optionFromResult of responseBody as any) {
              const category = optionFromResult.heading;

              let index = linkRatingOptions.findIndex((option) => option.category == category);

              if(index == -1) {
                const ratingCateogory = {
                  category: optionFromResult.heading,
                  chosen: false,
                  options: []
                }
                linkRatingOptions.push(ratingCateogory);
                index = linkRatingOptions.length -1;
              }

              const option = {
                label: optionFromResult.text,
                value: optionFromResult.id
              }
              linkRatingOptions[index].options.push(option);
            }

            observer.next(linkRatingOptions);
          } catch (error) {
            observer.error(error);
          }
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });
      }
    )
  }

  sendLinkRating(linkRating: any): Observable<any> {
    console.log('linkRating', linkRating);
    return this.http.post<any>(`${environment.apiUrl}/LinkRating`, linkRating);
  }

  seachLifecourses(lifeCourseIds: string[]|number[]): Observable<ElasticSearchResult> {
    const body = {
      query: {
        terms: {
          life_course_id: lifeCourseIds
        }
      }
    };

    return new Observable(
      observer => {
        return this.http.post<ElasticSearchResult>(`${environment.apiUrl}/search/lifecourses`, body).pipe(share())
        .subscribe(next => {
            observer.next(next);
          }, error => {
            observer.error(error);
          }, () => {
            observer.complete();
          }
        )
      }
    );
  }
};